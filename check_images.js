const checkImages = async () => {
    const urls = [
        'https://assets.coingecko.com/coins/images/25691/small/zcPXETKs_400x400.jpg', // SAGA
        'https://assets.coingecko.com/coins/images/35436/small/portal.jpeg', // PORTAL
        'https://assets.coingecko.com/coins/images/38247/small/lista_logo.jpg', // LISTA
        'https://assets.coingecko.com/coins/images/35100/small/pixel-icon.png', // PIXELS
        'https://assets.coingecko.com/coins/images/34258/small/round_icon_2048_px.png' // XAI
    ];

    for (const url of urls) {
        try {
            const res = await fetch(url, { method: 'HEAD' });
            console.log(url, '=> status:', res.status, res.headers.get('content-type'));
        } catch(e) {
            console.log(url, '=> ERROR:', e.message);
        }
    }
}

checkImages();
