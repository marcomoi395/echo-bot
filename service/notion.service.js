const {Client} = require("@notionhq/client")
const notion = new Client({auth: process.env.NOTION_KEY})

module.exports.addBudgetTracker = async (description, amount, date, type) => {
    try {
        const response = await notion.pages.create({
            parent: {database_id: process.env.NOTION_DATABASE_ID},
            properties: {
                "Type": {
                    "id": "ZBTi",
                    "type": "select",
                    "select": {
                        "id": type === 'Income' ? "BhO{" : "th^v" || '',
                        "name": type,
                        "color": type === 'Income' ? "green" : "red",
                    }
                },
                "Date": {
                    "id": "fk%7Bf",
                    "type": "date",
                    "date": {
                        "start": date || '',
                        "end": null,
                        "time_zone": null,
                    }
                },
                "Amount": {
                    "id": "ugl%3C",
                    "type": "number",
                    "number": amount || null,
                },
                "Description": {
                    "id": "title",
                    "type": "title",
                    "title": [
                        {
                            "type": "text",
                            "text": {
                                "content": description || '',
                                "link": null
                            },
                            "annotations": {
                                "bold": false,
                                "italic": false,
                                "strikethrough": false,
                                "underline": false,
                                "code": false,
                                "color": "default"
                            },
                            "plain_text": description || '',
                            "href": null
                        }
                    ]
                }
            },
        })
        return true;
    } catch
        (e) {
        console.log(e)
        return false;
    }
}

module.exports.getBudgetTracker = async () => {
    try {
        return notion.databases.query({
            database_id: process.env.NOTION_DATABASE_ID,
        })
    } catch (e) {
        console.log(e)
    }
}

module.exports.checkRecordExists = async (transactionId) => {
    try {
        const response = await notion.databases.query({
            database_id: process.env.NOTION_DATABASE_ID,
            filter: {
                property: 'TransactionId', // Thay đổi 'Name' thành thuộc tính bạn muốn tìm kiếm
                rich_text: {
                    equals: transactionId,
                },
            },
        });

        // Kiểm tra xem record có tồn tại không
        if (response.results.length > 0) {
            console.log('Record exists:', response.results);
            return true; // Record tồn tại
        } else {
            console.log('Record does not exist.');
            return false; // Record không tồn tại
        }
    } catch (error) {
        console.error('Error checking record:', error);
        return false; // Xử lý lỗi
    }
}