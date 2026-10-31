
let db;

// 初始化 SQLite 資料庫
async function initDatabase() {
    try {
        const SQL = await initSqlJs({
            locateFile: file =>
                `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`
        });

        // 建立瀏覽器端 SQLite 資料庫
        db = new SQL.Database();

        // 開啟外鍵功能
        db.run("PRAGMA foreign_keys = ON;");

        // 建立資料表
        const schemaResponse = await fetch("database/schema.sql");
        if (!schemaResponse.ok) {
            throw new Error("無法讀取 schema.sql");
        }

        const schema = await schemaResponse.text();
        db.run(schema);

        // 匯入測試資料
        const dataResponse = await fetch("database/sample_data.sql");
        if (!dataResponse.ok) {
            throw new Error("無法讀取 sample_data.sql");
        }

        const sampleData = await dataResponse.text();
        db.run(sampleData);

        document.getElementById("result").innerHTML =
            "<p>資料庫載入成功！可以開始執行 SQL 查詢。</p>";

    } catch (error) {
        document.getElementById("result").innerHTML =
            `<p style="color:red;">資料庫初始化失敗：${error.message}</p>`;
    }
}

// 執行 SQL 查詢

// 執行 SQL 查詢
function runSQL() {
    const sql = document.getElementById("sqlInput").value.trim();
    const resultArea = document.getElementById("result");

    if (!sql) {
        resultArea.innerHTML = "<p>請先輸入 SQL 語法！</p>";
        return;
    }

    try {
        const results = db.exec(sql);

        if (results.length === 0) {
            resultArea.innerHTML =
                "<p>SQL 執行成功，但沒有可顯示的查詢結果。</p>";
            return;
        }

        let html = "";
        let totalRows = 0;
        let totalColumns = 0;

        results.forEach(result => {
            const rowCount = result.values.length;
            const columnCount = result.columns.length;

            totalRows += rowCount;
            totalColumns += columnCount;

            html += "<table><thead><tr>";

            result.columns.forEach(column => {
                html += `<th>${escapeHTML(column)}</th>`;
            });

            html += "</tr></thead><tbody>";

            result.values.forEach(row => {
                html += "<tr>";

                row.forEach(value => {
                    html += `<td>${escapeHTML(value ?? "NULL")}</td>`;
                });

                html += "</tr>";
            });

            html += "</tbody></table>";
        });

        // 顯示查詢統計資訊
        const summary = `
            <div class="result-summary">
                <span>查詢結果：成功</span>
                <span>資料筆數：${totalRows}</span>
                <span>欄位數量：${totalColumns}</span>
            </div>
        `;

        resultArea.innerHTML = summary + html;

    } catch (error) {
        resultArea.innerHTML =
            `<p style="color:red;">
                SQL 執行錯誤：${escapeHTML(error.message)}
            </p>`;
    }
}


// 避免查詢結果中的文字被當成 HTML
function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


// 綁定執行按鈕
document.getElementById("runButton").addEventListener("click", runSQL);

// 綁定常用 SQL 範例按鈕
document.querySelectorAll(".example-button").forEach(button => {
    button.addEventListener("click", () => {
        const query = button.dataset.query;

        document.getElementById("sqlInput").value = query;
    });
});

// 啟動資料庫
initDatabase();

