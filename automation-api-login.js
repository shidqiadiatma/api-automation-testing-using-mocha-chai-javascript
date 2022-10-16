const request_url = require("supertest")("http://barru.pythonanywhere.com");
const assert = require("chai").expect;

describe("POST /login", function () { // JUDUL, JADI SINGKAT AJA
  it("Verify Success Login with valid email and password", async function () { // DESKRIPSI
    const response = await request_url // INI BUAT NGARAH KE URL BARRU.PYTHONANYWHERE.COM
      .post("/login") // INI ENDPOINT SETELAH .COM
      .send({ email: "shidqi.ngetes@gmail.com", password: "QaGabut100persen" }); // INI SESUAI BODY

    const isi_data = response.body;

    assert(response.body.status).to.eql('SUCCESS_LOGIN');
    assert(response.body.message).to.eql('Anda Berhasil Login');
    assert(isi_data).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Login with invalid email and valid password", async function () { 
    const response = await request_url 
      .post("/login")
      .send({ email: "shidqi.ngetes", password: "QaGabut100persen" });

    const isi_data = response.body;

    assert(response.body.status).to.eql('FAILED_LOGIN');
    assert(isi_data).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Login with random email and valid password", async function () { 
    const response = await request_url 
      .post("/login")
      .send({ email: "shidqi.asdajsdasdasd@bkabka.com", password: "QaGabut100persen" });

    const isi_data = response.body;

    assert(response.body.status).to.eql('FAILED_LOGIN');
    assert(isi_data).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Login with phone number and valid password", async function () { 
    const response = await request_url 
      .post("/login")
      .send({ email: "088823772363", password: "QaGabut100persen" });

    const isi_data = response.body;

    assert(response.body.status).to.eql('FAILED_LOGIN');
    assert(isi_data).to.include.keys("data", "message", "status"); 
  });


  it("Verify Failed Login with username and valid password", async function () { 
    const response = await request_url 
      .post("/login")
      .send({ email: "shidqiadiatma", password: "QaGabut100persen" });

    const isi_data = response.body;

    assert(response.body.status).to.eql('FAILED_LOGIN');
    assert(isi_data).to.include.keys("data", "message", "status"); 
  });


  it("Verify Failed Login with empty email and valid password", async function () { 
    const response = await request_url 
      .post("/login")
      .send({ email: "", password: "QaGabut100persen" });

    const isi_data = response.body;

    assert(response.body.status).to.eql('FAILED_LOGIN');
    assert(isi_data).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Login with empty Body Only Dictionary", async function () { 
    const response = await request_url 
      .post("/login")
      .send({ });

      assert(response.status).to.eql(500);
  });

  it("Verify Failed Login with empty email and empty password", async function () { 
    const response = await request_url 
      .post("/login")
      .send({ email: "", password: "" });

    const isi_data = response.body;

    assert(response.body.status).to.eql('FAILED_LOGIN');
    assert(isi_data).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Login with valid email and empty password", async function () { 
    const response = await request_url 
      .post("/login")
      .send({ email: "shidqi.ngetes@gmail.com", password: "" });

    const isi_data = response.body;

    assert(response.body.status).to.eql('FAILED_LOGIN');
    assert(isi_data).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Login with SQLI in password", async function () { 
    const response = await request_url
      .post("/login")
      .send({ email: "shidqi.ngetes@gmail.com", 
              password: "SELECT%count%(*)%FROM%Users%WHERE%Username='jebol'%or%1=1%--%'%AND%Password=%'email'"});

    const isi_data = response.body;

    assert(response.body.status).to.eql('FAILED_LOGIN');
    assert(response.body.message).to.eql("Tidak boleh mengandung symbol");
    assert(isi_data).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Login with SQLI in email", async function () { 
    const response = await request_url
      .post("/login")
      .send({ email: "SELECT%count%(*)%FROM%Users%WHERE%Username='jebol'%or%1=1%--%'%AND%Password=%'email'", 
              password: "QaGabut100persen"});

    const isi_data = response.body;

    assert(response.body.status).to.eql('FAILED_LOGIN');
    assert(response.body.message).to.eql("Cek kembali email anda");
    assert(isi_data).to.include.keys("data", "message", "status"); 
  });

describe("Verify Max Login for User in 1 IP Address", function () { 
  for (i = 0; i<5; i++) {
    let nomer = i;
    it("Tes ke " + [i] + " Failed Login Max in 1 Session", async function () { 
      const response = await request_url
        .post("/login")
        .send({ email: "shidqi.ngetes@gmail.com", password: "QaGabut100persen", ip_address: "127.107.42.1"});

      const isi_data = response.body;

      if (nomer === 4) {
        // console.log("Tes ke " + nomer + " failed login attemp")
        assert(response.body.status).to.eql('FAILED_LOGIN');
        assert(response.body.data).to.eql('IP Address Anda diblokir');
        assert(isi_data).to.include.keys("data", "message", "status");
      }

      assert(response.body.status).to.eql('FAILED_LOGIN');
      assert(isi_data).to.include.keys("data", "message", "status"); 
    });
  }
});

it("Verify Failed Login with Max Char in Email Field", async function () {
    let max_email = Array.from(Array(55), () => Math.floor(Math.random() * 36).toString(36)).join('');
    const response = await request_url
    .post("/login") 
    .send({ email: max_email + "@gmail.com", password: "QaGabut100persen" });

    const isi_data = response.body;

    assert(response.body.status).to.eql('FAILED_LOGIN');
    assert(response.body.data).to.eql('Email/Password melebihin maksimal karakter');
    assert(isi_data).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Login with Max Char in Password Field", async function () {
    let max_password = Array.from(Array(55), () => Math.floor(Math.random() * 36).toString(36)).join('');
    const response = await request_url
    .post("/login") 
    .send({ email: "shidqi.ngetes@gmail.com", password: max_password });

    const isi_data = response.body;

    assert(response.body.status).to.eql('FAILED_LOGIN');
    assert(response.body.data).to.eql('Email/Password melebihin maksimal karakter');
    assert(isi_data).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Login with Method GET", async function () {
    const response = await request_url
    .get("/login") 
    .send({ email: "shidqi.ngetes@gmail.com", password: "QaGabut100persen" });

    assert(response.status).to.eql(405);
  });

  it("Verify Failed Login with Method PUT", async function () {
    let random_text = Math.random().toString(36).substring(7);
    const response = await request_url
    .put("/login") 
    .send({ email: "shidqi.ngetes@gmail.com", password: "QaGabut100persen" });

    assert(response.status).to.eql(405);
  });

  it("Verify Failed Login with Method PATCH", async function () {
    let random_text = Math.random().toString(36).substring(7);
    const response = await request_url
    .patch("/login") 
    .send({ email: "shidqi.ngetes@gmail.com", password: "QaGabut100persen" });

    assert(response.status).to.eql(405);
  });

  it("Verify Failed Login with Form-Data as Body", async function () {
    let random_text = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/login")
      .type('form')
      .send({ email: "shidqi.ngetes@gmail.com", password: "QaGabut100persen" });

    assert(response.status).to.eql(500);
  });

  it("Verify Failed Login with xx-www-form-urlencoded as Body", async function () {
    let random_text = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/login")
      .set('content-Type', 'application/x-www-form-urlencoded')
      .send({ email: 'shidqi.ngetes@gmail.com', password: 'QaGabut100persen' });

    assert(response.status).to.eql(500);
  });

  it("Verify Failed Login with Integer Type in Email", async function () {
    let random_text = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/login")
      .send({ email: 123456789, password: random_text});

    assert(response.status).to.eql(500);
  });

  it("Verify Failed Login with Integer Type in Password", async function () {
    let random_text = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/login")
      .send({ email: random_text + "@gmail.com", password: 123456789});

    assert(response.status).to.eql(500);
  });
});