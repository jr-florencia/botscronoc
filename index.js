//const botconfig = require("./botconfig.json"); \0
const tokenfile = require("./token.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({disableEveryone: true});
const serverid = "543354025387491339";

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
let levelhigh = 0;
let clearad;
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
var antiddos = 0;
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
 	bot.user.setGame("Developer's: Yuki Flores & Kory McGregor (Source Code)");

  //bot.user.setGame("on SourceCade!");
});

bot.login(process.env.token);









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
if(message.channel.name == "vote-1") {
	await message.react("😭");
	await message.react("😦");
	await message.react("😕");
	await message.react("🙂");
	await message.react("😀");
	return;
}
if(message.channel.name == "vote-2") {
	await message.react("😭");
	await message.react("😦");
	await message.react("😕");
	await message.react("🙂");
	await message.react("😀");
	return;
} 
if(message.content == "/offad") {
antiddos = 1;
message.reply("Система отключена на 3 минуты, успей раздать инвайт код");	
clearad = setTimeout({
antiddos = 0;
message.guild.channels.find(c => c.name == "antiddos-log").send(`**Система возобновляет защиту**`);	
}, 180000)
return;
}
if(message.content == "/offad") {
if(antiddos == 1) {
clearTimeout(clearad);
message.reply("**Система возобновлена в работу принудительно!**");
}
if(antiddos != 1) return message.reply("**Система запущена!**");
return;
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

   
});


bot.on('guildMemberAdd', async member => {
    if (member.guild.id != serverid) return
    if (antiddos == 1) {
     member.guild.channels.find(c => c.name == "antiddos-log").send(`\`[SYSTEM]\` ${member} \`мог быть заблокирован за попытку атаки. Система временно выключена\``);
     return;
    }
    levelhigh++;
    if (levelhigh >= 5){
        if (member.hasPermission("MANAGE_ROLES")){
            member.guild.channels.find(c => c.name == "antiddos-log").send(`\`[SYSTEM]\` ${member} \`мог быть заблокирован за попытку атаки. Уровень опасности: ${levelhigh}\``);
        }else{
            member.ban(`by BOT [DDOS]`);
            console.log(`${member.id} - заблокирован за ДДОС.`)
            member.guild.channels.find(c => c.name == "antiddos-log").send(`\`[SYSTEM]\` ${member} \`был заблокирован за попытку атаки. Уровень опасности: ${levelhigh}\``)
        }
        setTimeout(() => {
            if (levelhigh > 0){
                member.guild.channels.find(c => c.name == "antiddos-log").send(`\`[SYSTEM]\` \`Уровень опасности сервера был установлен с ${levelhigh} на ${+levelhigh - 1}.\``);
                levelhigh--;
            }
        }, 60000*levelhigh);
    }else{
        member.guild.channels.find(c => c.name == "antiddos-log").send(`\`[SYSTEM]\` ${member} \`вошел на сервер. Уровень опасности: ${levelhigh}/5\``)
        setTimeout(() => {
            if (levelhigh > 0){
                member.guild.channels.find(c => c.name == "antiddos-log").send(`\`[SYSTEM]\` \`Уровень опасности сервера был установлен с ${levelhigh} на ${+levelhigh - 1}.\``);
                levelhigh--;
            }
        }, 60000*levelhigh);
    }
})

