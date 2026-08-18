# Qwen setup for Nyra

Nyra’s in-app assistant now calls a protected Vercel function at `/api/ai/chat`. The browser never receives your Qwen provider key.

## Recommended initial configuration

Use **Alibaba Cloud Model Studio** with its OpenAI-compatible chat-completions API. The current default in the integration is **`qwen-plus`**, which is the official documented OpenAI-compatible example and is suitable for policy-aware assistant responses. When lower latency is more important than response depth, set `QWEN_MODEL` to the Flash-class model identifier currently enabled in your Model Studio account after checking its quota and pricing.

| Environment variable | Required value |
| --- | --- |
| `DASHSCOPE_API_KEY` | Your Alibaba Cloud Model Studio API key. Set it only in Vercel or another server-side environment. |
| `QWEN_BASE_URL` | Your Model Studio OpenAI-compatible base URL. For a Singapore workspace, use `https://{WorkspaceId}.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1` and replace `{WorkspaceId}` with the workspace shown in Model Studio. |
| `QWEN_MODEL` | `qwen-plus` to start. You may switch to a supported Flash model after confirming its exact identifier and current quota in your own Model Studio console. |

## Deploy on Vercel

Open the Nyra project in Vercel, then add the three environment variables above in **Project Settings → Environment Variables**. Redeploy after saving them. The existing `api/ai/chat.js` serverless function will then call Qwen through the configured server-side endpoint.

> Do not add `DASHSCOPE_API_KEY` to `VITE_*` variables, source code, the client bundle, or Git. Those routes expose the key to every browser visitor.

## Free-trial note

Alibaba Cloud’s Model Studio documents new-user quota as region- and model-dependent, with international free quota periods commonly listed as 30–90 days. Confirm the models and remaining free quota shown in your own Singapore/international Model Studio account before launch. The app intentionally returns a clear configuration message until valid variables are available.

## References

- [Official Qwen API Platform](https://qwen.ai/apiplatform)
- [Model Studio OpenAI-compatible Chat documentation](https://www.alibabacloud.com/help/en/model-studio/compatibility-of-openai-with-dashscope)
- [Official Qwen structured-output documentation](https://www.alibabacloud.com/help/en/model-studio/qwen-structured-output)
- [Model Studio free-quota documentation](https://www.alibabacloud.com/help/en/model-studio/new-free-quota)
