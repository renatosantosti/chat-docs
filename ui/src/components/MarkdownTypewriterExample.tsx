import React from "react";
import MarkdownTypewriter from "./MarkdownTypewriter";

const MarkdownTypewriterExample: React.FC = () => {
  const sampleText = `Hello! This document appears to be a utility bill from Cesan, the Companhia Espírito-santense de Saneamento, specifically for water and sewage services. It provides a detailed breakdown of charges, water quality reports, and customer service information for a customer named Renato de Moura Santos.

## Key components of the bill include:

1. **Billing Details**: The document specifies the account information like the customer's name, address, and the type of connection (water and sewage).

2. **Service Charges**: 
   - Water consumption charges
   - Sewage treatment fees
   - Connection and maintenance costs

3. **Water Quality Information**: The bill includes details about water quality testing and compliance with health standards.

### Important Notes:
- All charges are calculated based on actual consumption
- Payment is due within 30 days of the billing date
- Late payments may incur additional fees

> **Customer Service**: For any questions or concerns, customers can contact Cesan through their customer service hotline or visit their website.

\`\`\`
Account Number: 123456789
Customer: Renato de Moura Santos
Service Period: January 2024
\`\`\`

This bill demonstrates the comprehensive nature of water utility services and the importance of maintaining clean water infrastructure for public health.`;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Markdown Typewriter Example</h1>
      <div className="bg-gray-50 border border-gray-200 p-6 rounded-md shadow-sm">
        <MarkdownTypewriter
          text={sampleText}
          speed={25}
          className="prose prose-sm max-w-none"
        />
      </div>
    </div>
  );
};

export default MarkdownTypewriterExample;
