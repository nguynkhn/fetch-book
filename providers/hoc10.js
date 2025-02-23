const axios = require('axios');

module.exports = {
  name: "Hoc10",
  apiUrl: "https://api.hoc10.vn/api",
  referer: "https://hoc10.vn",
  pageUrl: "https://hoc10.monkeyuni.net/E_Learning/page_public",
  fetch: async function (addBook) {
    const { list_book } = (await axios
      .get(`${this.apiUrl}/list-book?book_type_id=1,3,5`))
      .data.data;

    for (const { id, title } of list_book) {
      const { list_page } = (await axios
        .get(`${this.apiUrl}/get-detail-page?book_id=${id}`,
          { validateStatus: () => true }))
        .data.data;
      if (!list_page) {
        continue;
      }

      const pages = list_page.map(({ background }) => background
        .slice("E_Learning/page_public/".length));
      addBook(id, `${title} - Cánh diều`, pages);
    }
  },
};
