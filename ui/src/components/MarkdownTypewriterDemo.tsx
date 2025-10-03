import React from "react";
import MarkdownTypewriter from "./MarkdownTypewriter";
import MarkdownTypewriterNoCursor from "./MarkdownTypewriterNoCursor";

const MarkdownTypewriterDemo: React.FC = () => {
  const sampleText = `# Document Analysis

This document appears to be a **utility bill** from Cesan, the Companhia Espírito-santense de Saneamento, specifically for water and sewage services.

## Key Components

1. **Billing Details**: Account information including:
   - Customer name: Renato de Moura Santos
   - Service period: June 2024
   - Connection type: Water and sewage

2. **Service Charges**:
   - Water consumption charges
   - Sewage treatment fees
   - Connection maintenance costs

3. **Water Quality Information**: The bill includes details about water quality testing and compliance with health standards.

> **Important Note**: All charges are calculated based on actual consumption and payment is due within 30 days.

### Contact Information
For questions or concerns, customers can contact Cesan through:
- Customer service hotline
- Official website
- Local service centers

This comprehensive bill demonstrates the importance of maintaining clean water infrastructure for public health.`;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Markdown Typewriter Demo
      </h1>

      {/* Version with cursor */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Version with Cursor</h2>
        <div className="bg-gray-50 border border-gray-200 p-6 rounded-md shadow-sm">
          <MarkdownTypewriter
            text={sampleText}
            speed={30}
            className="prose prose-sm max-w-none"
          />
        </div>
      </div>

      {/* Version without cursor */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          Version without Cursor (Clean)
        </h2>
        <div className="bg-gray-50 border border-gray-200 p-6 rounded-md shadow-sm">
          <MarkdownTypewriterNoCursor
            text={sampleText}
            speed={30}
            className="prose prose-sm max-w-none"
          />
        </div>
      </div>

      {/* Usage instructions */}
      <div className="bg-blue-50 border border-blue-200 p-6 rounded-md">
        <h3 className="text-lg font-semibold mb-3 text-blue-900">
          Usage Instructions
        </h3>
        <div className="space-y-2 text-blue-800">
          <p>
            <strong>With Cursor:</strong> Use <code>MarkdownTypewriter</code>{" "}
            for traditional typewriter effect
          </p>
          <p>
            <strong>Without Cursor:</strong> Use{" "}
            <code>MarkdownTypewriterNoCursor</code> for clean, modern look
          </p>
          <p>
            <strong>Speed:</strong> Adjust speed prop (lower = faster, higher =
            slower)
          </p>
          <p>
            <strong>Styling:</strong> Use className prop for custom Tailwind
            classes
          </p>
        </div>
      </div>
    </div>
  );
};

export default MarkdownTypewriterDemo;
