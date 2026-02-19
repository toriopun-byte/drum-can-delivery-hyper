export async function onRequest(context) {
  const { request, env } = context;
  
  // APIルートのプロキシ処理
  const url = new URL(request.url);
  const path = url.pathname;
  
  if (path.startsWith('/api/')) {
    // Next.js APIルートに転送
    const nextUrl = `http://localhost:3000${path}${url.search}`;
    const response = await fetch(nextUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });
    
    return response;
  }
  
  // 静的ファイルの場合
  return context.next();
}
