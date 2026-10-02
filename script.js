const clientId = "b00b0c1791bd4cdface67724a736e791";
const apiSecret = "44c1006d0edb4e8bb2b777839555f47d";

async function obterToken() {
    const resposta = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + btoa(`${clientId}:${apiSecret}`)
        },
        body: "grant_type=client_credentials"
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error("Erro ao obter token.");
    }

    return dados.access_token;
}

async function carregarAlbuns() {
    const mensagem = document.querySelector("#mensagem");
    const lista = document.querySelector("#listaUsuarios");

    lista.textContent = "";
    mensagem.textContent = "Obtendo autorização do Spotify...";

    try {
        const token = await obterToken();
        mensagem.textContent = "Buscando Álbuns...";

        const idArtista = "6eUKZXaKkcviH0Ku9w2n3V";

        const resposta = await fetch(
            `https://api.spotify.com/v1/artists/${idArtista}/albums?limit=10`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(`Erro do Spotify: ${resposta.status}`);
        }

        const albuns = dados.items || [];

        for (let cont = 0; cont < albuns.length; cont++) {
            const album = albuns[cont];
            const cartao = document.createElement("article");

            const titulo = document.createElement("h2");
            titulo.textContent = album.name;

            const lancamento = document.createElement("p");
            lancamento.textContent = `Lançamento: ${album.release_date}`;

            const faixas = document.createElement("p");
            faixas.textContent = `Total de faixas: ${album.total_tracks}`;

            if (album.images && album.images.length > 0) {
                const imagem = document.createElement("img");
                imagem.src = album.images[0].url;
                imagem.alt = album.name;
                imagem.style.width = "150px";
                cartao.appendChild(imagem);
            }

            cartao.appendChild(titulo);
            cartao.appendChild(lancamento);
            cartao.appendChild(faixas);
            lista.appendChild(cartao);
        }

        mensagem.textContent = "Álbuns buscados com sucesso!";
    } catch (erro) {
        console.error(erro);
        mensagem.textContent = "Ocorreu um erro ao buscar os álbuns.";
    }
}