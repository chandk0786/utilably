// COMPLETE CODE TEMPLATES DATA - 7 TEMPLATES

export interface CodeTemplate {
  id: string;
  name: string;
  description: string;
  language: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
  code: string;
  variables: TemplateVariable[];
  dependencies?: string[];
  icon: string;
}

export interface TemplateVariable {
  id: string;
  name: string;
  label: string;
  type: "text" | "number" | "boolean" | "select";
  defaultValue: any;
  options?: { label: string; value: any }[];
  description: string;
  required: boolean;
}

// Programming Languages
export const programmingLanguages = [
  { id: "javascript", name: "JavaScript", icon: "🚀", color: "bg-yellow-100 text-yellow-800" },
  { id: "typescript", name: "TypeScript", icon: "📘", color: "bg-blue-100 text-blue-800" },
  { id: "python", name: "Python", icon: "🐍", color: "bg-green-100 text-green-800" },
  { id: "java", name: "Java", icon: "☕", color: "bg-red-100 text-red-800" },
  { id: "sql", name: "SQL", icon: "🗃️", color: "bg-gray-100 text-gray-800" },
  { id: "html", name: "HTML", icon: "🌐", color: "bg-orange-100 text-orange-800" },
  { id: "css", name: "CSS", icon: "🎨", color: "bg-blue-100 text-blue-800" },
];

// Categories
export const codeCategories = [
  { id: "web", name: "Web Development", icon: "🌐" },
  { id: "api", name: "API Development", icon: "🔌" },
  { id: "database", name: "Database", icon: "🗃️" },
  { id: "utilities", name: "Utilities", icon: "🛠️" },
];

// ALL 7 CODE TEMPLATES
export const codeTemplates: CodeTemplate[] = [
  // Template 1: Fetch API Wrapper
  {
    id: "js-fetch-api",
    name: "Fetch API Wrapper",
    description: "Reusable fetch API wrapper with error handling",
    language: "javascript",
    category: "web",
    difficulty: "beginner",
    tags: ["api", "http", "async"],
    icon: "🔌",
    dependencies: [],
    code: `async function fetchAPI(url, options = {}) {
  const { timeout = 10000, ...fetchOptions } = options;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
    }
    
    const data = await response.json();
    return { data, status: response.status, headers: response.headers };
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Usage example
async function getUserData(userId) {
  try {
    const result = await fetchAPI(\`https://api.example.com/users/\${userId}\`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer \${token}'
      }
    });
    return result.data;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
}`,
    variables: [
      {
        id: "url",
        name: "url",
        label: "API URL",
        type: "text",
        defaultValue: "https://api.example.com/data",
        description: "The endpoint URL to fetch data from",
        required: true,
      },
      {
        id: "timeout",
        name: "timeout",
        label: "Timeout (ms)",
        type: "number",
        defaultValue: 10000,
        description: "Request timeout in milliseconds",
        required: false,
      },
    ],
  },

  // Template 2: React Component
  {
    id: "ts-react-component",
    name: "React Component",
    description: "TypeScript React functional component with props",
    language: "typescript",
    category: "web",
    difficulty: "intermediate",
    tags: ["react", "typescript", "component"],
    icon: "⚛️",
    dependencies: ["react", "@types/react"],
    code: `import React, { useState, useEffect } from 'react';

interface {{componentName}}Props {
  title: string;
  initialCount?: number;
  onCountChange?: (count: number) => void;
  disabled?: boolean;
  className?: string;
}

const {{componentName}}: React.FC<{{componentName}}Props> = ({
  title,
  initialCount = 0,
  onCountChange,
  disabled = false,
  className = '',
}) => {
  const [count, setCount] = useState<number>(initialCount);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  const handleIncrement = () => {
    if (disabled) return;
    
    const newCount = count + 1;
    setCount(newCount);
    onCountChange?.(newCount);
  };

  const handleDecrement = () => {
    if (disabled || count <= 0) return;
    
    const newCount = count - 1;
    setCount(newCount);
    onCountChange?.(newCount);
  };

  const handleReset = () => {
    if (disabled) return;
    
    setCount(initialCount);
    onCountChange?.(initialCount);
  };

  return (
    <div className={\`p-4 border rounded-lg shadow-sm \${className}\`}>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={handleDecrement}
          disabled={disabled || count <= 0}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Decrement
        </button>
        
        <span className="text-2xl font-bold min-w-15 text-center">
          {count}
        </span>
        
        <button
          onClick={handleIncrement}
          disabled={disabled}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Increment
        </button>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={handleReset}
          disabled={disabled}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset
        </button>
        
        <button
          onClick={() => setIsLoading(!isLoading)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isLoading ? 'Loading...' : 'Toggle Loading'}
        </button>
      </div>
      
      {isLoading && (
        <div className="mt-4 p-2 bg-blue-50 text-blue-700 rounded">
          Loading component state...
        </div>
      )}
    </div>
  );
};

export default {{componentName}};`,
    variables: [
      {
        id: "componentName",
        name: "componentName",
        label: "Component Name",
        type: "text",
        defaultValue: "Counter",
        description: "Name of the React component",
        required: true,
      },
      {
        id: "includeLoading",
        name: "includeLoading",
        label: "Include Loading State",
        type: "boolean",
        defaultValue: true,
        description: "Add loading state functionality",
        required: false,
      },
    ],
  },

  // Template 3: FastAPI Endpoint
  {
    id: "python-fastapi",
    name: "FastAPI Endpoint",
    description: "FastAPI REST endpoint with validation",
    language: "python",
    category: "api",
    difficulty: "intermediate",
    tags: ["fastapi", "python", "api", "rest"],
    icon: "🚀",
    dependencies: ["fastapi", "pydantic"],
    code: `from fastapi import FastAPI, HTTPException, status, Depends
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

app = FastAPI(title="{{apiName}} API", version="1.0.0")

class {{modelName}}Base(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    price: float = Field(..., gt=0)

class {{modelName}}Create({{modelName}}Base):
    pass

class {{modelName}}({{modelName}}Base):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.now)

{{storageName}} = {}

@app.get("/")
async def root():
    return {"message": "Welcome to {{apiName}} API"}

@app.post("/{{routeName}}", response_model={{modelName}}, status_code=status.HTTP_201_CREATED)
async def create_{{routeName}}(item: {{modelName}}Create):
    new_item = {{modelName}}(
        name=item.name,
        description=item.description,
        price=item.price
    )
    {{storageName}}[new_item.id] = new_item
    return new_item

@app.get("/{{routeName}}", response_model=List[{{modelName}}])
async def get_all_{{routeName}}(skip: int = 0, limit: int = 10):
    items = list({{storageName}}.values())
    return items[skip:skip + limit]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port={{portNumber}})`,
    variables: [
      {
        id: "apiName",
        name: "apiName",
        label: "API Name",
        type: "text",
        defaultValue: "Product",
        description: "Name of your API",
        required: true,
      },
      {
        id: "modelName",
        name: "modelName",
        label: "Model Name",
        type: "text",
        defaultValue: "Product",
        description: "Name of your data model",
        required: true,
      },
      {
        id: "storageName",
        name: "storageName",
        label: "Storage Variable",
        type: "text",
        defaultValue: "products",
        description: "Name for storage dictionary",
        required: true,
      },
      {
        id: "routeName",
        name: "routeName",
        label: "Route Name",
        type: "text",
        defaultValue: "products",
        description: "Base route name",
        required: true,
      },
      {
        id: "portNumber",
        name: "portNumber",
        label: "Port Number",
        type: "number",
        defaultValue: 8000,
        description: "Port to run the server on",
        required: false,
      },
    ],
  },

  // Template 4: SQL CRUD Queries
  {
    id: "sql-crud-queries",
    name: "SQL CRUD Queries",
    description: "Complete SQL CRUD operations",
    language: "sql",
    category: "database",
    difficulty: "beginner",
    tags: ["sql", "database", "crud"],
    icon: "🗃️",
    dependencies: [],
    code: `-- Create {{tableName}} table
CREATE TABLE {{tableName}} (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO {{tableName}} (name, email) VALUES
('John Doe', 'john@example.com'),
('Jane Smith', 'jane@example.com');

-- SELECT all records
SELECT * FROM {{tableName}};

-- SELECT with WHERE
SELECT * FROM {{tableName}} WHERE name LIKE '%{{searchTerm}}%';

-- UPDATE record
UPDATE {{tableName}} 
SET email = '{{newEmail}}'
WHERE id = {{recordId}};

-- DELETE record
DELETE FROM {{tableName}} WHERE id = {{recordId}};`,
    variables: [
      {
        id: "tableName",
        name: "tableName",
        label: "Table Name",
        type: "text",
        defaultValue: "users",
        description: "Name of the database table",
        required: true,
      },
      {
        id: "searchTerm",
        name: "searchTerm",
        label: "Search Term",
        type: "text",
        defaultValue: "John",
        description: "Search term for WHERE clause",
        required: false,
      },
      {
        id: "newEmail",
        name: "newEmail",
        label: "New Email",
        type: "text",
        defaultValue: "updated@example.com",
        description: "New email for UPDATE",
        required: false,
      },
      {
        id: "recordId",
        name: "recordId",
        label: "Record ID",
        type: "number",
        defaultValue: 1,
        description: "ID of record to update/delete",
        required: false,
      },
    ],
  },

  // Template 5: Spring Boot Controller
  {
    id: "java-spring-controller",
    name: "Spring Boot Controller",
    description: "Spring Boot REST controller",
    language: "java",
    category: "api",
    difficulty: "advanced",
    tags: ["java", "spring", "rest"],
    icon: "☕",
    dependencies: ["spring-boot-starter-web"],
    code: `package {{packageName}}.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/{{endpointName}}")
public class {{modelName}}Controller {

    @GetMapping
    public List<{{modelName}}> getAll{{modelNamePlural}}() {
        // Return all items
        return List.of();
    }

    @GetMapping("/{id}")
    public {{modelName}} get{{modelName}}ById(@PathVariable {{idType}} id) {
        // Return item by ID
        return new {{modelName}}();
    }

    @PostMapping
    public {{modelName}} create{{modelName}}(@RequestBody {{modelName}} {{variableName}}) {
        // Create new item
        return {{variableName}};
    }

    @PutMapping("/{id}")
    public {{modelName}} update{{modelName}}(@PathVariable {{idType}} id, @RequestBody {{modelName}} {{variableName}}) {
        // Update existing item
        return {{variableName}};
    }

    @DeleteMapping("/{id}")
    public void delete{{modelName}}(@PathVariable {{idType}} id) {
        // Delete item
    }
}`,
    variables: [
      {
        id: "modelName",
        name: "modelName",
        label: "Model Name",
        type: "text",
        defaultValue: "Product",
        description: "Name of your model class",
        required: true,
      },
      {
        id: "modelNamePlural",
        name: "modelNamePlural",
        label: "Model Name (Plural)",
        type: "text",
        defaultValue: "Products",
        description: "Plural form of model name",
        required: true,
      },
      {
        id: "variableName",
        name: "variableName",
        label: "Variable Name",
        type: "text",
        defaultValue: "product",
        description: "Variable name for single instance",
        required: true,
      },
      {
        id: "packageName",
        name: "packageName",
        label: "Package Name",
        type: "text",
        defaultValue: "com.example",
        description: "Java package name",
        required: true,
      },
      {
        id: "endpointName",
        name: "endpointName",
        label: "Endpoint Name",
        type: "text",
        defaultValue: "products",
        description: "API endpoint path",
        required: true,
      },
      {
        id: "idType",
        name: "idType",
        label: "ID Type",
        type: "text",
        defaultValue: "Long",
        description: "Data type for ID field",
        required: false,
      },
    ],
  },

  // Template 6: HTML Contact Form
  {
    id: "html-form",
    name: "HTML Contact Form",
    description: "Responsive HTML contact form",
    language: "html",
    category: "web",
    difficulty: "beginner",
    tags: ["html", "form", "contact"],
    icon: "📝",
    dependencies: [],
    code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{pageTitle}}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            padding: 20px;
            background-color: #f4f4f4;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        
        h1 {
            color: #333;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #555;
        }
        
        input, textarea, select {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
        }
        
        input:focus, textarea:focus, select:focus {
            outline: none;
            border-color: #007bff;
        }
        
        button {
            background: #007bff;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            width: 100%;
        }
        
        button:hover {
            background: #0056b3;
        }
        
        .required {
            color: red;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>{{formTitle}}</h1>
        <form id="{{formId}}" action="{{formAction}}" method="{{formMethod}}">
            <div class="form-group">
                <label for="name">Name <span class="required">*</span></label>
                <input type="text" id="name" name="name" required placeholder="Enter your name">
            </div>
            
            <div class="form-group">
                <label for="email">Email <span class="required">*</span></label>
                <input type="email" id="email" name="email" required placeholder="Enter your email">
            </div>
            
            {{#if includePhone}}
            <div class="form-group">
                <label for="phone">Phone Number</label>
                <input type="tel" id="phone" name="phone" placeholder="Enter your phone number">
            </div>
            {{/if}}
            
            <div class="form-group">
                <label for="subject">Subject</label>
                <select id="subject" name="subject">
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="message">Message <span class="required">*</span></label>
                <textarea id="message" name="message" rows="5" required placeholder="Enter your message"></textarea>
            </div>
            
            <div class="form-group">
                <label>
                    <input type="checkbox" name="newsletter" checked>
                    Subscribe to newsletter
                </label>
            </div>
            
            <button type="submit">{{submitText}}</button>
        </form>
    </div>
    
    <script>
        document.getElementById('{{formId}}').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Form submitted successfully!');
            // Add your form submission logic here
        });
    </script>
</body>
</html>`,
    variables: [
      {
        id: "formTitle",
        name: "formTitle",
        label: "Form Title",
        type: "text",
        defaultValue: "Contact Us",
        description: "Title displayed on the form",
        required: true,
      },
      {
        id: "includePhone",
        name: "includePhone",
        label: "Include Phone Field",
        type: "boolean",
        defaultValue: true,
        description: "Add phone number field to form",
        required: false,
      },
      {
        id: "formId",
        name: "formId",
        label: "Form ID",
        type: "text",
        defaultValue: "contactForm",
        description: "HTML ID for the form",
        required: false,
      },
      {
        id: "submitText",
        name: "submitText",
        label: "Submit Button Text",
        type: "text",
        defaultValue: "Send Message",
        description: "Text on submit button",
        required: false,
      },
    ],
  },

  // Template 7: CSS Grid Layout
  {
    id: "css-grid-layout",
    name: "CSS Grid Layout",
    description: "Responsive CSS Grid layout",
    language: "css",
    category: "web",
    difficulty: "intermediate",
    tags: ["css", "grid", "layout", "responsive"],
    icon: "🎨",
    dependencies: [],
    code: `/* {{layoutName}} - Responsive Grid Layout */
.{{containerClass}} {
    display: grid;
    grid-template-columns: repeat({{columns}}, 1fr);
    grid-gap: {{gap}}px;
    padding: {{padding}}px;
    margin: 0 auto;
    max-width: {{maxWidth}}px;
}

.{{itemClass}} {
    background: {{itemBackground}};
    border-radius: {{borderRadius}}px;
    padding: {{itemPadding}}px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.{{itemClass}}:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.{{headerClass}} {
    grid-column: 1 / -1;
    text-align: center;
    padding: {{headerPadding}}px;
    background: {{headerBackground}};
    border-radius: {{borderRadius}}px;
}

.{{sidebarClass}} {
    grid-column: span {{sidebarColumns}};
    background: {{sidebarBackground}};
}

.{{mainClass}} {
    grid-column: span {{mainColumns}};
    background: {{mainBackground}};
}

.{{footerClass}} {
    grid-column: 1 / -1;
    text-align: center;
    padding: {{footerPadding}}px;
    background: {{footerBackground}};
    border-radius: {{borderRadius}}px;
    margin-top: {{marginTop}}px;
}

/* Responsive Breakpoints */
@media (max-width: 768px) {
    .{{containerClass}} {
        grid-template-columns: 1fr;
    }
    
    .{{sidebarClass}},
    .{{mainClass}} {
        grid-column: 1 / -1;
    }
}

@media (min-width: 769px) and (max-width: 1024px) {
    .{{containerClass}} {
        grid-template-columns: repeat({{tabletColumns}}, 1fr);
    }
}

/* Animation for items */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.{{itemClass}} {
    animation: fadeIn 0.6s ease-out;
}

/* Stagger animation */
.{{itemClass}}:nth-child(2) { animation-delay: 0.1s; }
.{{itemClass}}:nth-child(3) { animation-delay: 0.2s; }
.{{itemClass}}:nth-child(4) { animation-delay: 0.3s; }
.{{itemClass}}:nth-child(5) { animation-delay: 0.4s; }
.{{itemClass}}:nth-child(6) { animation-delay: 0.5s; }`,
    variables: [
      {
        id: "columns",
        name: "columns",
        label: "Number of Columns",
        type: "number",
        defaultValue: 3,
        description: "Number of grid columns on desktop",
        required: true,
      },
      {
        id: "gap",
        name: "gap",
        label: "Grid Gap (px)",
        type: "number",
        defaultValue: 20,
        description: "Space between grid items in pixels",
        required: false,
      },
      {
        id: "containerClass",
        name: "containerClass",
        label: "Container Class",
        type: "text",
        defaultValue: "grid-container",
        description: "CSS class for grid container",
        required: true,
      },
      {
        id: "itemClass",
        name: "itemClass",
        label: "Item Class",
        type: "text",
        defaultValue: "grid-item",
        description: "CSS class for grid items",
        required: true,
      },
    ],
  },
];

// Helper functions
export const getTemplateById = (id: string): CodeTemplate | undefined => {
  return codeTemplates.find(template => template.id === id);
};

export const getTemplatesByLanguage = (language: string): CodeTemplate[] => {
  return codeTemplates.filter(template => template.language === language);
};

export const getTemplatesByCategory = (category: string): CodeTemplate[] => {
  return codeTemplates.filter(template => template.category === category);
};

export const searchTemplates = (query: string): CodeTemplate[] => {
  const searchTerm = query.toLowerCase();
  return codeTemplates.filter(template =>
    template.name.toLowerCase().includes(searchTerm) ||
    template.description.toLowerCase().includes(searchTerm) ||
    template.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
};

export const popularTemplates = [
  "js-fetch-api",
  "ts-react-component",
  "python-fastapi",
];