import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"), // Suas extensões originais

  // Adicione este objeto para configurar especificamente a regra no-unused-vars
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"], // Aplica a arquivos TypeScript
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn", // Ou "error" se preferir que o build falhe. "warn" é o padrão do Next.js.
        {
          "vars": "all", // Verifica todas as variáveis (declaradas com var, let, const)
          "varsIgnorePattern": "^_", // Ignora variáveis que começam com _
          "args": "after-used", // Verifica argumentos de função não utilizados após o último uso (ou 'all' para todos)
          "argsIgnorePattern": "^_", // Ignora argumentos que começam com _
          "caughtErrors": "all", // Verifica todos os erros capturados em blocos catch
          "caughtErrorsIgnorePattern": "^_", // Ignora erros capturados que começam com _
          "ignoreRestSiblings": true, // Permite que "irmãos rest" não utilizados sejam ignorados (ex: const { a, ...rest } = obj;)
        },
      ],
      // Você pode adicionar outras customizações de regras aqui se necessário
    },
  },
];

export default eslintConfig;