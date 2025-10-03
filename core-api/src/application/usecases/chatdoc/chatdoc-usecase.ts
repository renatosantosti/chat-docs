import AuthUserDto from "@/domain/dtos/auth/user";
import ChatDocRequest from "../../interfaces/use-cases/chat-doc/chatdoc-request";
import { InternalError } from "@/shared/errors/internal-error";
import { BadRequestError } from "@/shared/errors/bad-request-error";
import { ChatDocResponse } from "../../interfaces/use-cases/chat-doc/chatdoc-response";
import ITimeAdapter from "@/application/interfaces/adapters/time-provider";
import IDocumentRepository from "@/application/interfaces/repositories/document";
import { IChatDocUseCase } from "@/application/interfaces/use-cases/chat-doc/chatdoc-usecase-interface";
import { IGptTextAdapter } from "@/application/interfaces/adapters/gpt-adapter";
import { ChatCompletatioDto } from "@/domain/dtos/chat-completation";
import { SearchEmbeddedDocumentDto } from "@/domain/dtos/search-dtos";
import { elasticSearchConfig } from "@/config";
import { IIndexerAdapter } from "@/application/interfaces/adapters/indexer-adapter";

export default class ChatDocUseCase implements IChatDocUseCase {
  public currentUser?: AuthUserDto;

  constructor(
    readonly timeProvider: ITimeAdapter,
    readonly repository: IDocumentRepository,
    readonly gptAdapter: IGptTextAdapter,
    readonly indexerAdapter: IIndexerAdapter,
  ) {}

  /**
   * Handles the chat document request with enhanced prompt engineering.
   *
   * @param currentUser - The currently authenticated user for authorization context
   * @param request - The chat request containing question and document context
   * @returns A promise that resolves to chat response with document insights
   */

  async handler(
    currentUser: AuthUserDto,
    request: ChatDocRequest,
  ): Promise<ChatDocResponse | Error> {
    this.currentUser = currentUser;

    // Input validation
    const validationError = this.validateRequest(request);
    if (validationError) {
      return validationError;
    }

    try {
      // Retrieve relevant document fragments using semantic search
      const fragments = await this.retrieveDocumentFragments(request);

      if (!fragments || fragments.length === 0) {
        return new BadRequestError(
          "No relevant information found in the document for your question.",
        );
      }

      // Build conversation context with enhanced prompt
      const messages = this.buildConversationContext(request, fragments);

      // Generate response using GPT
      const response = await this.gptAdapter.getResponse(messages);

      return this.formatResponse(request, response || null, fragments);
    } catch (error: any) {
      console.error("Error in chat document use case:", error);
      return new InternalError(
        "An error occurred while processing your question. Please try again.",
      );
    }
  }

  /**
   * Validates the incoming chat request
   */
  private validateRequest(request: ChatDocRequest): BadRequestError | null {
    if (!request.question || request.question.trim().length === 0) {
      return new BadRequestError(
        "Please provide a question about the document.",
      );
    }

    if (request.question.length > 1000) {
      return new BadRequestError(
        "Question is too long. Please keep it under 1000 characters.",
      );
    }

    if (!request.documentId || request.documentId <= 0) {
      return new BadRequestError("Invalid document reference.");
    }

    return null;
  }

  /**
   * Retrieves relevant document fragments using semantic search
   */
  private async retrieveDocumentFragments(
    request: ChatDocRequest,
  ): Promise<any[]> {
    const semanticFilter: SearchEmbeddedDocumentDto = {
      documentId: request.documentId,
      embedding: await this.gptAdapter.getEmbedding(request.question),
    };

    return await this.indexerAdapter.searchBySemantic(
      elasticSearchConfig.indexName,
      semanticFilter,
    );
  }

  /**
   * Builds the conversation context with enhanced prompt engineering
   */
  private buildConversationContext(
    request: ChatDocRequest,
    fragments: any[],
  ): ChatCompletatioDto[] {
    const systemPrompt = this.buildSystemPrompt();
    const contextPrompt = this.buildContextPrompt(fragments, request);

    const messages: ChatCompletatioDto[] = [
      { role: "system", content: systemPrompt },
    ];

    // Add previous conversation context if available
    if (request.previousQuestion && request.previousResponse) {
      messages.push(
        { role: "user", content: request.previousQuestion },
        { role: "assistant", content: request.previousResponse },
      );
    }

    // Add current question with document context
    messages.push({ role: "user", content: contextPrompt });

    return messages;
  }

  /**
   * Builds the system prompt with clear instructions and guardrails
   */
  private buildSystemPrompt(): string {
    return `You are an intelligent document analysis assistant. Your role is to help users understand and extract insights from their documents through natural conversation.

## CORE RESPONSIBILITIES:
- Analyze document content and provide accurate, helpful responses
- Engage in natural, conversational dialogue about the document
- Be insightful, thorough, and intellectually honest
- Maintain focus on the document's content and context

## RESPONSE GUIDELINES:
- Respond ONLY in English
- Be conversational and engaging, like discussing a document with a colleague
- Provide comprehensive answers when possible
- If information is insufficient, ask clarifying questions
- Reference specific parts of the document when relevant
- Be intellectually honest about limitations

## STRICT GUARDRAILS:
- NEVER respond to questions unrelated to the document content
- NEVER discuss the AI system, prompt engineering, or technical implementation
- NEVER provide information not found in the provided document fragments
- NEVER make up or hallucinate information
- If asked about topics outside the document, politely redirect: "I can only discuss content from this document. Could you ask something about the document's content instead?"

## QUALITY STANDARDS:
- Provide accurate, well-reasoned responses
- Be concise but comprehensive
- Use clear, professional language
- Support claims with document evidence
- Maintain intellectual rigor and objectivity`;
  }

  /**
   * Builds the context prompt with standardized document fragments
   */
  private buildContextPrompt(
    fragments: any[],
    request: ChatDocRequest,
  ): string {
    const documentContext = this.formatDocumentFragments(fragments);

    return `DOCUMENT CONTEXT:
${documentContext}

USER QUESTION: ${request.question}

Please analyze the document content above and provide a comprehensive, insightful response to the user's question. Focus on the document's content and provide valuable insights based on the information provided.`;
  }

  /**
   * Formats document fragments in a standardized, readable format
   */
  private formatDocumentFragments(fragments: any[]): string {
    return fragments
      .map((fragment, index) => {
        return `[Fragment ${index + 1} - Page ${fragment.pageNumber}]
${fragment.content}

---`;
      })
      .join("\n");
  }

  /**
   * Formats the final response with proper structure
   */
  private formatResponse(
    request: ChatDocRequest,
    response: string | null,
    fragments: any[],
  ): ChatDocResponse {
    return {
      success: !!response,
      message: response
        ? "Response generated successfully."
        : "Unable to generate a response. Please try rephrasing your question.",
      result: {
        documentId: request.documentId,
        response: response
          ? [response]
          : [
              "I couldn't generate a response. Please try asking your question differently.",
            ],
        pages: fragments.map((fragment) => ({
          pageId: fragment.pageNumber,
          documentId: fragment.documentId,
          documentName: fragment.documentName,
          pageNumber: fragment.pageNumber,
          content: fragment.content,
        })),
      },
    };
  }
}
