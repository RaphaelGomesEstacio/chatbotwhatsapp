const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const client = new Client();

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Tudo certo! WhatsApp conectado.');
});

client.initialize();

const delay = ms => new Promise(res => setTimeout(res, ms));

const estados = new Map();

client.on('message', async msg => {
    if (msg.body.match(/(menu|Menu|dia|tarde|noite|oi|Oi|Olá|olá|ola|Ola|Olá Tenho interesse e queria mais informações, porfavor)/i) && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        const contact = await msg.getContact();
        const name = contact.pushname;
        await client.sendMessage(msg.from,'Olá! '+ name.split(" ")[0] + ' como posso ajudar? Caso seja seu interesse em vender seu ar, digite uma das opções abaixo:\n\n1 - Ar 7500 Btus \n2 - Ar de 10 à 12 Mil Btus \n3 - Ar de 18 à 30 Mil Btus');
        estados.set(msg.from, 'menu');
        await delay(3000);
        await chat.sendStateTyping();
        await delay(5000);
        return;
    }

    if (estados.get(msg.from) === 'menu') {
        const chat = await msg.getChat();
            await delay(3000);
            await chat.sendStateTyping();
            await delay(3000);
        if (msg.body === '1') {
            estados.set(msg.from, 'confirmacao_70');
            await client.sendMessage(msg.from, 'Pagamos no seu Ar R$70,00 Aceita ?');
            const chat = await msg.getChat();
            await delay(3000);
            await chat.sendStateTyping();
            await delay(3000);
            await client.sendMessage(msg.from, 'Digite:\n1 - SIM\n2 - NÃO');
        } else if (msg.body === '2') {
            estados.set(msg.from, 'confirmacao_100');
            await client.sendMessage(msg.from, 'Pagamos no seu Ar R$100,00 Aceita ?');
            const chat = await msg.getChat();
            await delay(3000);
            await chat.sendStateTyping();
            await delay(3000);
            await client.sendMessage(msg.from, 'Digite:\n1 - SIM\n2 - NÃO');
        } else if (msg.body === '3') {
            estados.set(msg.from, 'confirmacao_150');
            await client.sendMessage(msg.from, 'Pagamos no seu Ar R$150,00 Aceita ?');
            const chat = await msg.getChat();
            await delay(3000);
            await chat.sendStateTyping();
            await delay(3000);
            await client.sendMessage(msg.from, 'Digite:\n1 - SIM\n2 - NÃO');
        } else {
            await client.sendMessage(msg.from, 'Opção inválida. Por favor, digite 1, 2 ou 3.');
        }
        return;
    }

    if (estados.get(msg.from) && estados.get(msg.from).startsWith('confirmacao_')) {
        const chat = await msg.getChat();
        if (msg.body === '1') {
            await delay(3000);
            await chat.sendStateTyping();
            await delay(3000);
            await client.sendMessage(msg.from, 'Vou te transferir para um atendente agendar a retirada.');
            
            await delay(3000);
            await chat.sendStateTyping();
            await delay(3000);
            await client.sendMessage(msg.from, 'Obrigado pelo contato! Em breve um atendente falará com você.');
            
            estados.delete(msg.from);
        } else if (msg.body === '2') {
            await delay(3000);
            await chat.sendStateTyping();
            await delay(3000);
            await client.sendMessage(msg.from, 'Agradecemos sua mensagem, até logo!');
            
            estados.delete(msg.from);
        } else {
            await client.sendMessage(msg.from, 'Opção inválida. Por favor, digite 1 para SIM ou 2 para NÃO.');
        }
        return;
    }
});
