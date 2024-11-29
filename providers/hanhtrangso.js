const axios = require('axios');

module.exports = {
  name: "Hành Trang Số",
  apiUrl: "https://apihanhtrangso.nxbgd.vn:8080/api",
  pageUrl: "https://cdnlearning.nxbgd.vn/uploads/books",
  fetch: async function (addBook) {
    const account = {
      email: process.env.HANHTRANGSO_EMAIL,
      password: process.env.HANHTRANGSO_PASSWORD,
    };

    let headers = {}, expireTime;
    const checkLogin = async () => {
      if (Date.now() < expireTime * 1000) {
        return;
      }

      const { accessToken } = (await axios
        .post(`${this.apiUrl}/login`, account))
        .data.data;
      headers.Authorization = `Bearer ${accessToken}`;
      
      const buffer = Buffer.from(accessToken.split('.')[1], "base64");
      expireTime = JSON.parse(buffer.toString()).exp;
    };

    await checkLogin();
    const bookList = (await axios
      .post(`${this.apiUrl}/book/book-list`, {}, { headers }))
      .data.data
      .map(({ bookGroups }) => bookGroups.map(({ books }) => books).flat())
      .flat();

    for (const { bookId, name } of bookList) {
      await checkLogin();

      const { totalPage, fileName } = (await axios
        .get(`${this.apiUrl}/book/${bookId}`, { headers }))
        .data.data;
      if (!fileName) {
        continue;
      }

      const pages = [...Array(totalPage).keys()]
        .map(index => `${fileName}-${index + 1}.jpg`);
      addBook(bookId, name, pages);
    }
  },
};