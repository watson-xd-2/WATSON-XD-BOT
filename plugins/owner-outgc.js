let handler = async (m, { conn, usedPrefix, command, args }) => {
    m.react("⌛");

    let groupList = await conn.groupFetchAllParticipating();
    let groups = Object.values(groupList);

    if (groups.length === 0) return m.reply('The bot is not part of any groups.');

    // Handle leaving a group
    if (args[0] && !isNaN(args[0])) {
        let groupIndex = parseInt(args[0]) - 1;
        if (groupIndex < 0 || groupIndex >= groups.length) return m.reply('Invalid group number.');
        let groupId = groups[groupIndex].id;
        await conn.groupLeave(groupId);
        return m.reply(`✅ Successfully left the group: ${groups[groupIndex].subject}`);
    }

    // Pagination
    let page = args[0] && isNaN(args[0]) ? parseInt(args[0]) : 1;
    let perPage = 5;
    let totalPages = Math.ceil(groups.length / perPage);
    if (!page || page < 1) page = 1;
    if (page > totalPages) page = totalPages;

    let start = (page - 1) * perPage;
    let end = start + perPage;
    let groupsPage = groups.slice(start, end);

    // Create buttons for each group
    let buttons = groupsPage.map((group, index) => ({
        buttonId: `${usedPrefix + command} ${start + index + 1}`,
        buttonText: { displayText: group.subject },
        type: 1
    }));

    // Navigation buttons
    if (page > 1) buttons.push({ buttonId: `${usedPrefix + command} ${page - 1}`, buttonText: { displayText: '⬅️ Previous' }, type: 1 });
    if (page < totalPages) buttons.push({ buttonId: `${usedPrefix + command} ${page + 1}`, buttonText: { displayText: 'Next ➡️' }, type: 1 });

    await conn.sendMessage(m.chat, {
        text: `*Select a group to leave:* (Page ${page}/${totalPages})`,
        footer: 'Tap a button to leave the group',
        buttons,
        headerType: 1
    }, { quoted: m });
};

handler.help = ['outgc'];
handler.tags = ['owner'];
handler.command = ['outgc'];
handler.rowner = true;

export default handler;