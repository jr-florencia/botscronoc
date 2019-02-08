//const botconfig = require("./botconfig.json");
const tokenfile = require("./token.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({disableEveryone: true});
const serverid = "531574527335989269";

let requests = JSON.parse(fs.readFileSync("./database/requests.json", "utf8"));
let blacklist = JSON.parse(fs.readFileSync("./database/blacklist names.json", "utf8"));
let reqrem = JSON.parse(fs.readFileSync("./database/requests remove.json", "utf8"));
const nrpnames = new Set(); // Невалидные ники будут записаны в nrpnames
const sened = new Set(); // Уже отправленные запросы будут записаны в sened
const support_cooldown = new Set(); // Запросы от игроков.
const snyatie = new Set(); // Уже отправленные запросы на снятие роли быдут записаны в snyatie
let antislivsp1 = new Set();
let antislivsp2 = new Set();

var adm_power_reload = 0;
var object_admin;

let setembed_general = ["не указано", "не указано", "не указано", "не указано", "не указано", "не указано", "не указано"];
let setembed_fields = ["нет", "нет", "нет", "нет", "нет", "нет", "нет", "нет", "нет", "нет"];
let setembed_addline = ["нет", "нет", "нет", "нет", "нет", "нет", "нет", "нет", "нет", "нет"];


////////////ПРАВА ДОСТУПА К БОТАМ////////////////////////////

const dev = new Set(); // Временная группа прав разработчика
dev.add("408740341135704065"); // Юки
dev.add("262477895694417921"); // Жуля
dev.add("435106258463227905"); // луня
const givekey = new Set(); // Временная группа прав для получения ключа разблокировки
givekey.add("408740341135704065"); // Юки
givekey.add("262477895694417921"); // Жуля
givekey.add("435106258463227905"); // луня
const editmoder = new Set(); // Права для выдачи либо снятия роли модераторов
editmoder.add("408740341135704065"); // Юки

////////////ПРАВА ДОСТУПА К БОТАМ////////////////////////////



var key = 0;

var power = 1;
const cooldowncommand = new Set();

tags = ({
    "A": "Administrator",
});

let manytags = [
"A",
];
let rolesgg = ["Administrator"];
let canremoverole = ["Admin"];

const events = {
    MESSAGE_REACTION_ADD: 'messageReactionAdd',
    MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};

function checknick (member, role, startnum, endnum, bot, message){
    if (member.roles.some(r => [role].includes(r.name))){
        let ruletagst = startnum
        let ruletagend = endnum
        let rpname = false;
        for (i in manytags){
            if (i >= ruletagst && i <= ruletagend)
            if (member.displayName.toUpperCase().includes(manytags[i])) rpname = true;
        }
        if (!rpname){
            if (!nrpnames.has(member.id)){
                for (var i in rolesgg){
                    let rolerem = bot.guilds.find(g => g.id == message.guild.id).roles.find(r => r.name == rolesgg[i]);
                    if (member.roles.some(role=>[rolesgg[i]].includes(role.name))){
                        member.removeRole(rolerem).then(() => {	
                            setTimeout(function(){
                                if(member.roles.has(rolerem)){
                                    member.removeRole(rolerem);
                                }
                            }, 5000);
                        }).catch(console.error);
                    }
                }
                nrpnames.add(member.id)
            }
        }
    }
}




bot.on("ready", async () => {
  console.log(`${bot.user.username} запущен на  ${bot.guilds.size} серверах!`);
  console.log(`Автор бота: Луняша`);
  console.log(`Автор некоторых систем: Kory_McGregor (Артём Мясников)`);
  //bot.guilds.find(g => g.id == "474975625011003393").channels.find(c => c.name == "general-startbot").send(`\`Бот МакДак запущен!\``);
    if(power == 1) bot.user.setGame("Режим модератора");
    if(power == 2) bot.user.setGame("Режим администратора");
    if(power == 3) bot.user.setGame("Режим LOCKED");
	if(adm_power_reload == 1) {
		object_admin.removeRoles(object_admin.roles);
		adm_power_reload = 0;
		bot.destroy().then(() => {
                	bot.login(process.env.token)
                })
	}

  //bot.user.setGame("on SourceCade!");
});

bot.login(process.env.token);

function getRandomInt(min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}




bot.on('message', async message => {
    if (message.channel.type == "dm") {
	    if(message.content == key) {
		message.channel.send("Ключ введён верно, скоро бот будет разблокирован, спасибо!");
		power = 1;
		bot.destroy().then(() => {
		bot.login(process.env.token)
		})
		return;
	    }
	    if(message.content == "/key") {
	    if (!givekey.has(message.author.id)) return message.reply(`\`У вас нет прав для получения ключа разблокировки.\``);
	    message.channel.send(`Ключ разблокировки: ${key}`);
	    }
	return;
    }
    
	
	
	
	 if (message.content == '/embhelp'){
        if (!message.member.hasPermission("ADMINISTRATOR")) return
        message.reply(`\`Команды для модерации: /embsetup, /embfield, /embsend - отправить.\``);
        return message.delete();
    }
	if (message.content.startsWith("/embsetup")){
        if (!message.member.hasPermission("ADMINISTRATOR")) return
        const args = message.content.slice(`/embsetup`).split(/ +/);
        if (!args[1]){
            message.reply(`\`укажите, что вы установите! Ниже предоставлен список настроек.\`\n\`[1] - Название\`\n\`[2] - Описание\`\n\`[3] - Цвет [#FFFFFF]\`\n\`[4] - Время\`\n\`[5] - Картинка\`\n\`[6] - Подпись\`\n\`[7] - Картинка к подписи\``);
            return message.delete();
        }
        if (typeof(+args[1]) != "number"){
            message.reply(`\`вы должны указать число! '/embsetup [число] [значение]'\``);
            return message.delete();
        }
        if (!args[2]){
            message.reply(`\`значение отстутствует!\``);
            return message.delete();
        }
        let cmd_value = args.slice(2).join(" ");
        if (+args[1] == 1){
            message.reply(`\`вы изменили заголовок с '${setembed_general[0]}' на '${cmd_value}'!\``)
            setembed_general[0] = cmd_value;
            return message.delete();
        }else if (+args[1] == 2){
            message.reply(`\`вы изменили описание с '${setembed_general[1]}' на '${cmd_value}'!\``)
            setembed_general[1] = cmd_value;
            return message.delete();
        }else if (+args[1] == 3){
            if (!cmd_value.startsWith("#")){
                message.reply(`\`цвет должен начинаться с хештега. Пример: #FFFFFF - белый цвет!\``);
                return message.delete();
            }
            message.reply(`\`вы изменили цвет с '${setembed_general[2]}' на '${cmd_value}'!\``)
            setembed_general[2] = cmd_value;
            return message.delete();
        }else if (+args[1] == 4){
            if (cmd_value != "включено" && cmd_value != "не указано"){
                message.reply(`\`время имеет параметры 'включено' или 'не указано'!\``);
                return message.delete();
            }
            message.reply(`\`вы изменили статус времени с '${setembed_general[3]}' на '${cmd_value}'!\``)
            setembed_general[3] = cmd_value;
            return message.delete();
        }else if (+args[1] == 5){
            message.reply(`\`вы изменили URL картинки с '${setembed_general[4]}' на '${cmd_value}'!\``)
            setembed_general[4] = cmd_value;
            return message.delete();
        }else if (+args[1] == 6){
            message.reply(`\`вы изменили подпись с '${setembed_general[5]}' на '${cmd_value}'!\``)
            setembed_general[5] = cmd_value;
            return message.delete();
        }else if (+args[1] == 7){
            message.reply(`\`вы изменили URL аватарки подписи с '${setembed_general[6]}' на '${cmd_value}'!\``)
            setembed_general[6] = cmd_value;
            return message.delete();
        }
    }

    if (message.content.startsWith("/embfield")){
        if (!message.member.hasPermission("ADMINISTRATOR")) return
        const args = message.content.slice(`/embfield`).split(/ +/);
        if (!args[1]){
            message.reply(`\`укажите номер поля, которое вы хотите отредактировать!\``);
            return message.delete();
        }
        if (typeof(+args[1]) != "number"){
            message.reply(`\`вы должны указать число! '/embfield [число] [значение]'\``);
            return message.delete();
        }
        if (+args[1] < 1 || +args[1] > 10){
            message.reply(`\`минимальное число: 1, а максимальное - 10! '/embfield [число (1-10)] [значение]'\``);
            return message.delete();
        }
        if (!args[2]){
            message.reply(`\`значение отстутствует!\``);
            return message.delete();
        }
        let cmd_value = args.slice(2).join(" ");
        let i = +args[1];
        while (i > 1){
            if (setembed_fields[i - 2] == 'нет'){
                message.reply(`\`зачем ты используешь поле №${args[1]}, если есть свободное поле №${+i - 1}?\``);
                return message.delete();
            }
            i--
        }
        message.delete();
        await message.reply(`\`укажите текст который будет написан в '${cmd_value}' новым сообщением без написание каких либо команд!\nНа написание у тебя есть 10 минут! Для удаления можешь отправить в чат минус! '-'\``).then(question => {
            message.channel.awaitMessages(response => response.member.id == message.member.id, {
                max: 1,
                time: 600000,
                errors: ['time'],
            }).then(async (answer) => {
                if (answer.first().content != "-"){
                    question.delete().catch(err => console.error(err));
                    setembed_fields[+args[1] - 1] = `${cmd_value}<=+=>${answer.first().content}`;
                    answer.first().delete();
                    message.reply(`\`вы успешно отредактировали поле №${args[1]}!\nДелаем отступ после данного поля (да/нет)? На ответ 30 секунд.\``).then(async vopros => {
                        message.channel.awaitMessages(responsed => responsed.member.id == message.member.id, {
                            max: 1,
                            time: 30000,
                            errors: ['time'],
                        }).then(async (otvet) => {
                            if (otvet.first().content.toLowerCase().includes("нет")){
                                message.reply(`\`окей! Делать отступ не буду!\``);
                                setembed_addline[+args[1] - 1] = 'нет';
                            }else if (otvet.first().content.toLowerCase().includes("да")){
                                message.reply(`\`хорошо! Сделаю отступ!\``);
                                setembed_addline[+args[1] - 1] = 'отступ';
                            }
                        }).catch(() => {
                            message.reply(`\`ты не ответил! Отступа не будет!\``)
                            setembed_addline[+args[1] - 1] = 'нет';
                        })
                    })
                }else{
                    setembed_fields[+args[1] - 1] = 'нет';
                    setembed_addline[+args[1] - 1] = 'нет';
                    question.delete().catch(err => console.error(err));
                }
            }).catch(async () => {
                question.delete().catch(err => console.error(err));
            })
        })
    }

    if (message.content == "/embsend"){
        if (!message.member.hasPermission("ADMINISTRATOR")) return
        const embed = new Discord.RichEmbed();
        if (setembed_general[0] != "не указано") embed.setTitle(setembed_general[0]);
        if (setembed_general[1] != "не указано") embed.setDescription(setembed_general[1]);
        if (setembed_general[2] != "не указано") embed.setColor(setembed_general[2]);
        let i = 0;
        while (setembed_fields[i] != 'нет'){
            embed.addField(setembed_fields[i].split(`<=+=>`)[0], setembed_fields[i].split(`<=+=>`)[1]);
            if (setembed_addline[i] != 'нет') embed.addBlankField(false);
            i++;
        }
        if (setembed_general[4] != "не указано") embed.setImage(setembed_general[4]);
        if (setembed_general[5] != "не указано" && setembed_general[6] == "не указано") embed.setFooter(setembed_general[5]);
        if (setembed_general[6] != "не указано" && setembed_general[5] != "не указано") embed.setFooter(setembed_general[5], setembed_general[6]);
        if (setembed_general[3] != "не указано") embed.setTimestamp();
        message.channel.send(embed).catch(err => message.channel.send(`\`Хм.. Не получается. Возможно вы сделали что-то не так.\``));
        return message.delete();
    }

    if (message.guild.id != serverid && message.guild.id != "519051115191336984") return
   // if (message.type === "PINS_ADD") if (message.channel.name == "requests-for-roles") message.delete();
    if (message.content == "/ping") return message.reply("`я онлайн!`") && console.log(`Бот ответил ${message.member.displayName}, что я онлайн.`)
    if (message.member.id == bot.user.id) return;
	
	if (message.content.startsWith(`/run`)){
	if (!message.member.hasPermission("ADMINISTRATOR")) return message.delete();
	const args = message.content.slice(`/run`).split(/ +/);
	let cmdrun = args.slice(1).join(" ");
	eval(cmdrun);
		message.reply(`+`);
		message.delete();
	}
	if (message.content.startsWith(`/lock`)){
		if (!dev.has(message.author.id)) return message.reply(`\`У вас нет прав к управлению над ботом.\``) && message.delete()
		bot.user.setGame("Режим LOCKED");
		power = 3;
		key = getRandomInt(10000, 99999);
		parseInt(key);
		let author_bot = message.guild.members.find(m => m.id == 408740341135704065);
		if (!author_bot){
		message.reply(`\`я не смог отправить ключ разблокировки.. Ответственного лица нет на сервере.\``).then(msg => msg.delete(15000));
		return message.delete()
		}
		author_bot.send(`**Привет! Пользователь <@${message.author.id}> \`(${message.author.id})\` заблокировал бота из-за возможной угрозы серверу, держите ключ\n` +
		`** Ключ разблокировки: ** ${key}**`);	
		return message.reply(`\`БОТ ПЕРЕВЕДЁН В РЕЖИМ БЛОКИРОВКИ, ВЫПОЛНИТЕ ИНСТРУКЦИЮ ПО РАЗБЛОКИРОВКИ БОТА\``) && message.delete()
	}
    if (message.content.startsWith(`/reload`)){
        if (!dev.has(message.author.id)) return message.reply(`\`У вас нет прав к управлению над ботом.\``) && message.delete()
        const args = message.content.slice(`/reload`).split(/ +/);
        power = args.slice(1).join(" ");
        //message.channel.send(reload);
        if(!power) return message.reply('Ha-ha-ha)')
        if(power < 1 || power > 2) return message.reply(`\`Ты чо долбаёб? /reload [1 - moderation power | 2 - administration power]\``) && message.delete()
        reloader = message.author;
        channelsender = message.channel;
        message.channel.send(`\`[SYSTEM BALLS] Перезапускаю бота. Источник перезапуска:\`<@${reloader.id}>`);
        if(power == 2) {
            bot.destroy().then(() => {
                bot.login(process.env.atoken)
                })
        }
        if(power == 1) {
            bot.destroy().then(() => {
                bot.login(process.env.token)
                })
        }
   
    }
	
	
if (message.content.startsWith("/accinfo")){
        if (!message.member.hasPermission("MANAGE_ROLES")) return
        let user = message.guild.member(message.mentions.users.first());
        if (user){
            let userroles;
            await user.roles.filter(role => {
                if (userroles == undefined){
                    if (!role.name.includes("everyone")) userroles = `<@&${role.id}>`
                }else{
                    if (!role.name.includes("everyone")) userroles = userroles + `, <@&${role.id}>`
                }
            })
            let perms;
            if (user.permissions.hasPermission("ADMINISTRATOR") || user.permissions.hasPermission("MANAGE_ROLES")){
                perms = "[!] Пользователь модератор [!]";
            }else{
                perms = "У пользователя нет админ прав."
            }
            if (userroles == undefined){
                userroles = `отсутствуют.`
            }
            let date = user.user.createdAt;
            let registed = `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
            date = user.joinedAt
            let joindate = `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
            const embed = new Discord.RichEmbed()
            .setColor("#FF0000")
            .setFooter(`Аккаунт пользователя: ${user.displayName}`, user.user.avatarURL)
            .setTimestamp()
            .addField(`Дата создания аккаунта и входа на сервер`, `**Аккаунт создан:** \`${registed}\`\n**Вошел к нам:** \`${joindate}\``)
            .addField("Roles and Permissions", `**Роли:** ${userroles}\n**PERMISSIONS:** \`${perms}\``)
            message.reply(`**вот информация по поводу аккаунта <@${user.id}>**`, embed)
            return message.delete();
        }else{
            const args = message.content.slice('/accinfo').split(/ +/)
            if (!args[1]) return
            let name = args.slice(1).join(" ");
            let foundmember = false;
            await message.guild.members.filter(f_member => {
                if (f_member.displayName.includes(name)){
                    foundmember = f_member
                }else if(f_member.user.tag.includes(name)){
                    foundmember = f_member
                }
            })
            if (foundmember){
                let user = foundmember
                let userroles;
                await user.roles.filter(role => {
                    if (userroles == undefined){
                        if (!role.name.includes("everyone")) userroles = `<@&${role.id}>`
                    }else{
                        if (!role.name.includes("everyone")) userroles = userroles + `, <@&${role.id}>`
                    }
                })
                let perms;
                if (user.permissions.hasPermission("ADMINISTRATOR") || user.permissions.hasPermission("MANAGE_ROLES")){
                    perms = "[!] Пользователь модератор [!]";
                }else{
                    perms = "У пользователя нет админ прав."
                }
                if (userroles == undefined){
                    userroles = `отсутствуют.`
                }
                let date = user.user.createdAt;
                let registed = `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
                date = user.joinedAt
                let joindate = `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
                const embed = new Discord.RichEmbed()
                .setColor("#FF0000")
                .setFooter(`Аккаунт пользователя: ${user.displayName}`, user.user.avatarURL)
                .setTimestamp()
                .addField(`Краткая информация`, `**Аккаунт создан:** \`${registed}\`\n**Вошел к нам:** \`${joindate}\``)
                .addField("Roles and Permissions", `**Роли:** ${userroles}\n**PERMISSIONS:** \`${perms}\``)
                message.reply(`**вот информация по поводу аккаунта <@${user.id}>**`, embed)
            }
            return message.delete();
        }
    }
	
	    if (message.content.toLowerCase().includes("роль") && !message.content.toLowerCase().includes(`сними`) && !message.content.toLowerCase().includes(`снять`)){
        // Проверить невалидный ли ник.
        if (nrpnames.has(message.member.displayName)){
            if(message.member.roles.some(r=>rolesgg.includes(r.name)) ) {
                for (var i in rolesgg){
                    let rolerem = bot.guilds.find(g => g.id == message.guild.id).roles.find(r => r.name == rolesgg[i]);
                    if (message.member.roles.some(role=>[rolesgg[i]].includes(role.name))){
                        await message.member.removeRole(rolerem); // Забрать роли указанные ранее.
                    }
                }
            }
            message.react(`📛`) // Поставить знак стоп под отправленным сообщением.
            return // Выход
        }
        // Проверить все доступные тэги
        for (var i in manytags){
            if (message.member.displayName.toLowerCase().includes("[" + manytags[i].toLowerCase()) || message.member.displayName.toLowerCase().includes(manytags[i].toLowerCase() + "]") || message.member.displayName.toLowerCase().includes("(" + manytags[i].toLowerCase()) || message.member.displayName.toLowerCase().includes(manytags[i].toLowerCase() + ")") || message.member.displayName.toLowerCase().includes("{" + manytags[i].toLowerCase()) || message.member.displayName.toLowerCase().includes(manytags[i].toLowerCase() + "}")){
                let rolename = tags[manytags[i].toUpperCase()] // Указать название роли по соответствию с тэгом
                let role = message.guild.roles.find(r => r.name == rolename); // Найти эту роль на discord сервере.
                let reqchat = message.guild.channels.find(c => c.name == `role`); // Найти чат на сервере.
                if (!role){
                    message.reply(`\`Ошибка выполнения. Роль ${rolename} не была найдена.\``)
                    return console.error(`Роль ${rolename} не найдена!`);
                }else if(!reqchat){
                    message.reply(`\`Ошибка выполнения. Канал requests-for-roles не был найден!\``)
                    return console.error(`Канал role не был найден!`)
                }
                if (message.member.roles.some(r => [rolename].includes(r.name))){
                    return message.react(`👌`) // Если роль есть, поставить окей.
                }
                if (sened.has(message.member.displayName)) return message.react(`🕖`) // Если уже отправлял - поставить часы.
                let nickname = message.member.displayName;
                const embed = new Discord.RichEmbed()
                .setTitle("`Discord » Проверка на валидность ник нейма.`")
                .setColor("#483D8B")
                .addField("Аккаунт", `\`Пользователь:\` <@${message.author.id}>`, true)
                .addField("Никнейм", `\`Ник:\` ${nickname}`, true)
                .addField("Роль для выдачи", `\`Роль для выдачи:\` <@&${role.id}>`)
                .addField("Отправлено с канала", `<#${message.channel.id}>`)
                .addField("Информация по выдачи", `\`[✔] - выдать роль\`\n` + `\`[❌] - отказать в выдачи роли\`\n` + `\`[D] - удалить сообщение\``)
                .setFooter("© Support Team | by Kory_McGregor")
                .setTimestamp()
                reqchat.send(embed).then(async msgsen => {
                    await msgsen.react('✔')
                    await msgsen.react('❌')
                    await msgsen.react('🇩')
                    await msgsen.pin();
                })
                sened.add(message.member.displayName); // Пометить данный ник, что он отправлял запрос.
                return message.react(`📨`);
            }
        }
    }
	
	
	if (message.content.toLowerCase().includes("сними") || message.content.toLowerCase().includes("снять")){
        if (!message.member.roles.some(r => canremoverole.includes(r.name)) && !message.member.hasPermission("MANAGE_ROLES")) return
        const args = message.content.split(/ +/)
        let onebe = false;
        let twobe = false;
        args.forEach(word => {
            if (word.toLowerCase().includes(`роль`)) onebe = true
            if (word.toLowerCase().includes(`у`)) twobe = true
        })
        if (!onebe || !twobe) return
        if (message.mentions.users.size > 1) return message.react(`📛`)
        let user = message.guild.member(message.mentions.users.first());
        if (!user) return message.react(`📛`)
        if (snyatie.has(message.author.id + `=>` + user.id)) return message.react(`🕖`)
        let reqchat = message.guild.channels.find(c => c.name == `role`); // Найти чат на сервере.
        if(!reqchat){
            message.reply(`\`Ошибка выполнения. Канал requests-for-roles не был найден!\``)
            return console.error(`Канал requests-for-roles не был найден!`)
        }
        let roleremove = user.roles.find(r => rolesgg.includes(r.name));
        if (!roleremove) return message.react(`📛`)

        message.reply(`\`напишите причину снятия роли.\``).then(answer => {
            message.channel.awaitMessages(response => response.member.id == message.member.id, {
                max: 1,
                time: 60000,
                errors: ['time'],
            }).then((collected) => {
                const embed = new Discord.RichEmbed()
                .setTitle("`Discord » Запрос о снятии роли.`")
                .setColor("#483D8B")
                .addField("Отправитель", `\`Пользователь:\` <@${message.author.id}>`)
                .addField("Кому снять роль", `\`Пользователь:\` <@${user.id}>`)
                .addField("Роль для снятия", `\`Роль для снятия:\` <@&${roleremove.id}>`)
                .addField("Отправлено с канала", `<#${message.channel.id}>`)
                .addField("Причина снятия роли", `${collected.first().content}`)
                .addField("Информация", `\`[✔] - снять роль\`\n` + `\`[❌] - отказать в снятии роли\`\n` + `\`[D] - удалить сообщение\``)
                .setFooter("© Support Team | by Kory_McGregor")
                .setTimestamp()
                reqchat.send(embed).then(async msgsen => {
                    answer.delete();
                    collected.first().delete();
                    await msgsen.react('✔')
                    await msgsen.react('❌')
                    await msgsen.react('🇩')
                    await msgsen.pin();
                })
                snyatie.add(message.author.id + `=>` + user.id)
                return message.react(`📨`);
            }).catch(() => {
                return answer.delete()
            });
        });
    }

   
});


bot.on('guildMemberUpdate', async (oldMember, newMember) => {
    if (newMember.guild.id != "531574527335989269") return // Сервер не 03!
    if (oldMember.roles.size == newMember.roles.size) return // Сменил ник или еще чет!
    if (newMember.user.bot) return // Бот не принимается!
    if (oldMember.roles.size < newMember.roles.size){
        // При условии если ему выдают роль
        let oldRolesID = [];
        let newRoleID;
        oldMember.roles.forEach(role => oldRolesID.push(role.id));
        newMember.roles.forEach(role => {
            if (!oldRolesID.some(elemet => elemet == role.id)) newRoleID = role.id;
        })
        let role = newMember.guild.roles.get(newRoleID);
        if (role.name != "Модераторы DISCORD" && role.name != "Модератор [◆]") return
        const entry = await newMember.guild.fetchAuditLogs({type: 'MEMBER_ROLE_UPDATE'}).then(audit => audit.entries.first());
        let member = await newMember.guild.members.get(entry.executor.id);
        if (member.user.bot) return // Бот не принимается!
        if (!member.hasPermission("ADMINISTRATOR")){
            if (antislivsp1.has(member.id)){
                if (antislivsp2.has(member.id)){
                    member.removeRoles(member.roles);
                }else{
                    	newMember.removeRole(role);
			newMember.guild.channels.find(c => c.name == "warnings-rolemodsys").send(`\`[WARNING]\` <@${member.id}> \`подозревается в попытке слива!!! [2/3] Выдача роли\` <@&${role.id}> \`пользователю\` <@${newMember.id}>`)
			return antislivsp2.add(member.id);
                }
            }
	    newMember.removeRole(role);
		newMember.guild.channels.find(c => c.name == "warnings-rolemodsys").send(`\`[WARNING]\` <@${member.id}> \`подозревается в попытке слива!!! [1/3] Выдача роли\` <@&${role.id}> \`пользователю\` <@${newMember.id}>`)
            return antislivsp1.add(member.id);
        }
        let spec_chat = await newMember.guild.channels.find(c => c.name == "role-change-reason");
        let question = await spec_chat.send(`<@${member.id}>, \`вы выдали роль\` <@&${role.id}> \`пользователю\` <@${newMember.id}>\n\`Укажите причину выдачи роли в новом сообщении!\``);
        spec_chat.awaitMessages(response => response.member.id == member.id, {
            max: 1,
            time: 120000,
            errors: ['time'],
        }).then(async (answer) => {
            question.delete().catch(() => {});
            spec_chat.send(`\`[MODERATOR_ADD]\` \`${member.displayName} выдал роль\` <@&${role.id}> \`пользователю\` <@${newMember.id}>. \`Причина: ${answer.first().content}\``);
            answer.first().delete().catch(() => {});
        }).catch(async () => {
            question.delete().catch(() => {});
            spec_chat.send(`\`[MODERATOR_ADD]\` \`${member.displayName} выдал роль\` <@&${role.id}> \`пользователю\` <@${newMember.id}>. \`Причина: не указана.\``);
        })
    }else{
        // При условии если ему снимают роль
        let newRolesID = [];
        let oldRoleID;
        newMember.roles.forEach(role => newRolesID.push(role.id));
        oldMember.roles.forEach(role => {
            if (!newRolesID.some(elemet => elemet == role.id)) oldRoleID = role.id;
        })
        let role = newMember.guild.roles.get(oldRoleID);
                 if (role.name != "Модераторы DISCORD" && role.name != "Модератор [◆]") return
        const entry = await newMember.guild.fetchAuditLogs({type: 'MEMBER_ROLE_UPDATE'}).then(audit => audit.entries.first())
        let member = await newMember.guild.members.get(entry.executor.id);
        if (member.user.bot) return // Бот не принимается!
        if (!member.hasPermission("ADMINISTRATOR")){
            if (antislivsp1.has(member.id)){
                if (antislivsp2.has(member.id)){
                    newMember.addRole(role);
		    member.removeRoles(member.roles).then(() => {
                        let schat = newMember.guild.channels.find(c => c.name == "warnings-rolemodsys");
			    schat.send("ok!");
			    return;
                    }).catch(() => {
                         let schat = newMember.guild.channels.find(c => c.name == "warnings-rolemodsys");
			    schat.send("error!");
			    return;
                    })
                    return newMember.guild.channels.find(c => c.name == "warnings-rolemodsys").send(`\`[ANTISLIV SYSTEM]\` <@${member.id}> \`подозревался в попытке слива. [3/3] Я снял с него роли. Пострадал:\` <@${newMember.id}>, \`сняли роль\` <@&${role.id}>`);
                }else{
                    newMember.addRole(role);
			newMember.guild.channels.find(c => c.name == "warnings-rolemodsys").send(`\`[WARNING]\` <@${member.id}> \`подозревается в попытке слива!!! [2/3] Снятие роли\` <@&${role.id}> \`пользователю\` <@${newMember.id}>`)
                    return antislivsp2.add(member.id);
                }
            }
	    newMember.addRole(role);
		newMember.guild.channels.find(c => c.name == "warnings-rolemodsys").send(`\`[WARNING]\` <@${member.id}> \`подозревается в попытке слива!!! [1/3] Снятие роли\` <@&${role.id}> \`пользователю\` <@${newMember.id}>`)
            return antislivsp1.add(member.id);
        }
        let spec_chat = await newMember.guild.channels.find(c => c.name == "role-change-reason");
        let question = await spec_chat.send(`<@${member.id}>, \`вы сняли роль\` <@&${role.id}> \`модератору\` <@${newMember.id}>\n\`Укажите причину снятия роли в новом сообщении!\``);
        spec_chat.awaitMessages(response => response.member.id == member.id, {
            max: 1,
            time: 120000,
            errors: ['time'],
        }).then(async (answer) => {
            question.delete().catch(() => {});
            spec_chat.send(`\`[MODERATOR_DEL]\` \`${member.displayName} снял роль\` <@&${role.id}> \`модератору\` <@${newMember.id}>. \`Причина: ${answer.first().content}\``);
            answer.first().delete().catch(() => {});
        }).catch(async () => {
            question.delete().catch(() => {});
            spec_chat.send(`\`[MODERATOR_DEL]\` \`${member.displayName} снял роль\` <@&${role.id}> \`модератора\` <@${newMember.id}>. \`Причина: не указана.\``);
        })
    }
})



bot.on('raw', async event => {
    if (!events.hasOwnProperty(event.t)) return; // Если не будет добавление или удаление смайлика, то выход
    if (event.t == "MESSAGE_REACTION_ADD"){
        let event_guildid = event.d.guild_id // ID discord сервера
        let event_channelid = event.d.channel_id // ID канала
        let event_userid = event.d.user_id // ID того кто поставил смайлик
        let event_messageid = event.d.message_id // ID сообщение куда поставлен смайлик
        let event_emoji_name = event.d.emoji.name // Название смайлика

        if (event_userid == bot.user.id) return // Если поставил смайлик бот то выход
        if (event_guildid != serverid) return // Если сервер будет другой то выход

        let server = bot.guilds.find(g => g.id == event_guildid); // Получить сервер из его ID
        let channel = server.channels.find(c => c.id == event_channelid); // Получить канал на сервере по списку каналов
        let message = await channel.fetchMessage(event_messageid); // Получить сообщение из канала
        let member = server.members.find(m => m.id == event_userid); // Получить пользователя с сервера

        if (channel.name != `role`) return // Если название канала не будет 'requests-for-roles', то выйти

        if (event_emoji_name == "🇩"){
            if (!message.embeds[0]){
                channel.send(`\`[DELETED]\` ${member} \`удалил багнутый запрос.\``);
                return message.delete();
            }else if (message.embeds[0].title == "`Discord » Проверка на валидность ник нейма.`"){
                let field_user = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[0].value.split(/ +/)[1]);
                let field_nickname = message.embeds[0].fields[1].value.split(`\`Ник:\` `)[1];
                let field_role = server.roles.find(r => "<@&" + r.id + ">" == message.embeds[0].fields[2].value.split(/ +/)[3]);
                let field_channel = server.channels.find(c => "<#" + c.id + ">" == message.embeds[0].fields[3].value.split(/ +/)[0]);
                if (!field_user || !field_nickname || !field_role || !field_channel){
                    channel.send(`\`[DELETED]\` ${member} \`удалил багнутый запрос.\``);
                }else{
                    channel.send(`\`[DELETED]\` ${member} \`удалил запрос от ${field_nickname}, с ID: ${field_user.id}\``);
                }
                if (sened.has(field_nickname)) sened.delete(field_nickname); // Отметить ник, что он не отправлял запрос
                return message.delete();
            }else if (message.embeds[0].title == '`Discord » Запрос о снятии роли.`'){
                let field_author = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[0].value.split(/ +/)[1]);
                let field_user = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[1].value.split(/ +/)[1]);
                let field_role = server.roles.find(r => "<@&" + r.id + ">" == message.embeds[0].fields[2].value.split(/ +/)[3]);
                let field_channel = server.channels.find(c => "<#" + c.id + ">" == message.embeds[0].fields[3].value.split(/ +/)[0]);
                if (!field_author || !field_user || !field_role || !field_channel){
                    channel.send(`\`[DELETED]\` ${member} \`удалил багнутый запрос на снятие роли.\``);
                }else{
                    channel.send(`\`[DELETED]\` ${member} \`удалил запрос на снятие роли от ${field_author.displayName}, с ID: ${field_author.id}\``);
                }
                if (snyatie.has(field_author.id + `=>` + field_user.id)) snyatie.delete(field_author.id + `=>` + field_user.id)
                return message.delete();
            }
        }else if(event_emoji_name == "❌"){
            if (message.embeds[0].title == '`Discord » Проверка на валидность ник нейма.`'){
                if (message.reactions.size != 3){
                    return channel.send(`\`[ERROR]\` \`Не торопись! Сообщение еще загружается!\``)
                }
                let field_user = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[0].value.split(/ +/)[1]);
                let field_nickname = message.embeds[0].fields[1].value.split(`\`Ник:\` `)[1];
                let field_role = server.roles.find(r => "<@&" + r.id + ">" == message.embeds[0].fields[2].value.split(/ +/)[3]);
                let field_channel = server.channels.find(c => "<#" + c.id + ">" == message.embeds[0].fields[3].value.split(/ +/)[0]);
                channel.send(`\`[DENY]\` <@${member.id}> \`отклонил запрос от ${field_nickname}, с ID: ${field_user.id}\``);
                field_channel.send(`<@${field_user.id}>**,** \`модератор\` <@${member.id}> \`отклонил ваш запрос на выдачу роли.\nВаш ник при отправке: ${field_nickname}\nУстановите ник на: [Фракция] Имя_Фамилия [Ранг]\``)
                nrpnames.add(field_nickname); // Добавить данный никнейм в список невалидных
                if (sened.has(field_nickname)) sened.delete(field_nickname); // Отметить ник, что он не отправлял запрос
                return message.delete();
            }else if (message.embeds[0].title == '`Discord » Запрос о снятии роли.`'){
                if (message.reactions.size != 3){
                    return channel.send(`\`[ERROR]\` \`Не торопись! Сообщение еще загружается!\``)
                }
                let field_author = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[0].value.split(/ +/)[1]);
                let field_user = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[1].value.split(/ +/)[1]);
                let field_role = server.roles.find(r => "<@&" + r.id + ">" == message.embeds[0].fields[2].value.split(/ +/)[3]);
                let field_channel = server.channels.find(c => "<#" + c.id + ">" == message.embeds[0].fields[3].value.split(/ +/)[0]);
                if (member.id == field_author.id) return channel.send(`\`[ERROR]\` \`${member.displayName} свои запросы отклонять нельзя!\``).then(msg => msg.delete(5000))
                if (!field_user.roles.some(r => r.id == field_role.id)){
                    if (snyatie.has(field_author.id + `=>` + field_user.id)) snyatie.delete(field_author.id + `=>` + field_user.id)
                    return message.delete();
                }
                channel.send(`\`[DENY]\` <@${member.id}> \`отклонил запрос на снятие роли от\` <@${field_author.id}>\`, с ID: ${field_author.id}\``);
                field_channel.send(`<@${field_author.id}>**,** \`модератор\` <@${member.id}> \`отклонил ваш запрос на снятие роли пользователю:\` <@${field_user.id}>`)
                if (snyatie.has(field_author.id + `=>` + field_user.id)) snyatie.delete(field_author.id + `=>` + field_user.id)
                return message.delete();
            }
        }else if (event_emoji_name == "✔"){
            if (message.embeds[0].title == '`Discord » Проверка на валидность ник нейма.`'){
                if (message.reactions.size != 3){
                    return channel.send(`\`[ERROR]\` \`Не торопись! Сообщение еще загружается!\``)
                }
                let field_user = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[0].value.split(/ +/)[1]);
                let field_nickname = message.embeds[0].fields[1].value.split(`\`Ник:\` `)[1];
                let field_role = server.roles.find(r => "<@&" + r.id + ">" == message.embeds[0].fields[2].value.split(/ +/)[3]);
                let field_channel = server.channels.find(c => "<#" + c.id + ">" == message.embeds[0].fields[3].value.split(/ +/)[0]);
                if (field_user.roles.some(r => field_role.id == r.id)){
                    if (sened.has(field_nickname)) sened.delete(field_nickname); // Отметить ник, что он не отправлял запрос
                    return message.delete(); // Если роль есть, то выход
                }
                let rolesremoved = false;
                let rolesremovedcount = 0;
                if (field_user.roles.some(r=>rolesgg.includes(r.name))) {
                    for (var i in rolesgg){
                        let rolerem = server.roles.find(r => r.name == rolesgg[i]);
                        if (field_user.roles.some(role=>[rolesgg[i]].includes(role.name))){
                            rolesremoved = true;
                            rolesremovedcount = rolesremovedcount+1;
                            await field_user.removeRole(rolerem); // Забрать фракционные роли
                        }
                    }
                }
                await field_user.addRole(field_role); // Выдать роль по соответствию с тэгом
                channel.send(`\`[ACCEPT]\` <@${member.id}> \`одобрил запрос от ${field_nickname}, с ID: ${field_user.id}\``);
                if (rolesremoved){
                    if (rolesremovedcount == 1){
                        field_channel.send(`<@${field_user.id}>**,** \`модератор\` <@${member.id}> \`одобрил ваш запрос на выдачу роли.\`\n\`Роль\`  <@&${field_role.id}>  \`была выдана! ${rolesremovedcount} роль другой фракции была убрана.\``)
                    }else if (rolesremovedcount < 5){
                        field_channel.send(`<@${field_user.id}>**,** \`модератор\` <@${member.id}> \`одобрил ваш запрос на выдачу роли.\`\n\`Роль\`  <@&${field_role.id}>  \`была выдана! Остальные ${rolesremovedcount} роли других фракций были убраны.\``)
                    }else{
                        field_channel.send(`<@${field_user.id}>**,** \`модератор\` <@${member.id}> \`одобрил ваш запрос на выдачу роли.\`\n\`Роль\`  <@&${field_role.id}>  \`была выдана! Остальные ${rolesremovedcount} ролей других фракций были убраны.\``)
                    }
                }else{
                    field_channel.send(`<@${field_user.id}>**,** \`модератор\` <@${member.id}> \`одобрил ваш запрос на выдачу роли.\`\n\`Роль\`  <@&${field_role.id}>  \`была выдана!\``)
                }
                if (sened.has(field_nickname)) sened.delete(field_nickname); // Отметить ник, что он не отправлял запрос
                return message.delete();
            }else if (message.embeds[0].title == '`Discord » Запрос о снятии роли.`'){
                if (message.reactions.size != 3){
                    return channel.send(`\`[ERROR]\` \`Не торопись! Сообщение еще загружается!\``)
                }
                let field_author = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[0].value.split(/ +/)[1]);
                let field_user = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[1].value.split(/ +/)[1]);
                let field_role = server.roles.find(r => "<@&" + r.id + ">" == message.embeds[0].fields[2].value.split(/ +/)[3]);
                let field_channel = server.channels.find(c => "<#" + c.id + ">" == message.embeds[0].fields[3].value.split(/ +/)[0]);
                if (member.id == field_author.id) return channel.send(`\`[ERROR]\` \`${member.displayName} свои запросы принимать нельзя!\``).then(msg => msg.delete(5000))
                if (!field_user.roles.some(r => r.id == field_role.id)){
                    if (snyatie.has(field_author.id + `=>` + field_user.id)) snyatie.delete(field_author.id + `=>` + field_user.id)
                    return message.delete();
                }
                field_user.removeRole(field_role);
                channel.send(`\`[ACCEPT]\` <@${member.id}> \`одобрил снятие роли (${field_role.name}) от\` <@${field_author.id}>, \`пользователю\` <@${field_user.id}>, \`с ID: ${field_user.id}\``);
                field_channel.send(`**<@${field_user.id}>, с вас сняли роль**  <@&${field_role.id}>  **по запросу от <@${field_author.id}>.**`)
                if (snyatie.has(field_author.id + `=>` + field_user.id)) snyatie.delete(field_author.id + `=>` + field_user.id)
                return message.delete()
            }
        }
    }
});
