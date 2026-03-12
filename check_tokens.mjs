const tokens = ['XAI','PIXEL','PIXELS','NEIRO','BOME','PNUT','SAGA','DOGS','LISTA','DYM','CATI','TNSR','PORTAL','HMSTR','W','MAGIC'];
const url = `${process.env.VITE_SUPABASE_URL}/rest/v1/tokens?select=ticker,name,current_price,change_24h&ticker=in.(${tokens.join(',')})`;

console.log('Fetching from:', url);

fetch(url, {
  headers: {
    apikey: process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    Authorization: `Bearer ${process.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
  }
})
.then(r => r.json())
.then(data => {
  console.log(JSON.stringify(data, null, 2));
})
.catch(console.error);
