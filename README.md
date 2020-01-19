# zoo-manager
## Uruchamianie

1. `npm i ` zarówno w folderze głównym oraz w folderze 'front'
2. `npm run dev` aby uruchomić appkę reactową i backend

W razie `Error: port in use` zmienić numer portu w pliku index.js 
```
await server.start(PORT, config);
```
