const request_url = require("supertest")("http://barru.pythonanywhere.com");
const assert = require("chai").expect;

describe("Test POST /REGISTER", function () { // DEKLARASI FUNCTION YANG AKAN DI TES
  it("Verify Success Register", async function () { // TEST CASE
    let random_email = Math.random().toString(36).substring(7); // MEMBUAT RANDOM KATA

    const response = await request_url // INI BUAT NGARAH KE URL BARRU.PYTHONANYWHERE.COM
      .post("/register")
      .send({ email: random_email + "@gmail.com", password: random_email, name: random_email }); // INI SESUAI BODY

    const hasil_response = response.body; // BERISI HASIL RESPONSE HASIL NEMBAK API, ADA DATA, MESSAGE, STATUS

    assert(response.body.status).to.eql('SUCCESS_REGISTER');
    assert(response.body.data).to.eql('berhasil');
    assert(response.body.message).to.eql('created user!');
    assert(hasil_response).to.include.keys("data", "message", "status"); 
  });

  it("Verify Success Register with Additional IP Address in Body", async function () {
    let random_text = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")
      .send({ email: random_text + "@gmail.com", password: random_text, name: random_text, ip_address: "127.0.0.1" });

    const hasil_response = response.body;
    assert(response.body.status).to.eql('SUCCESS_REGISTER');
    assert(response.body.data).to.eql('berhasil');
    assert(response.body.message).to.eql('created user!');
    assert(hasil_response).to.include.keys("data", "message", "status"); 
  });

  it("Verify Success Register with Additional Params", async function () {
    let random_text = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register?email=lalala&password=hahhaha")
      .send({ email: random_text + "@gmail.com", password: random_text, name: random_text, ip_address: "127.0.0.1" });

    const hasil_response = response.body;
    assert(response.body.status).to.eql('SUCCESS_REGISTER');
    assert(response.body.data).to.eql('berhasil');
    assert(response.body.message).to.eql('created user!');
    assert(hasil_response).to.include.keys("data", "message", "status"); 
  });

  it("Verify Success Register with Random Authorization", async function () {
    let random_text = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")
      .set({ Authorization: `Bearer asjdhgagduahuidghaiduawgdiuwaghsgjhagdjhgdshjsgd` })
      .send({ email: random_text + "@gmail.com", password: random_text, name: random_text});

    const hasil_response = response.body;
    assert(response.body.status).to.eql('SUCCESS_REGISTER');
    assert(response.body.data).to.eql('berhasil');
    assert(response.body.message).to.eql('created user!');
    assert(hasil_response).to.include.keys("data", "message", "status"); 
  });

  it("Verify Success Register with Random Authorization and Params", async function () {
    let random_text = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register?email=bahahahaahaha@gmail.com&password=waluyo")
      .set({ Authorization: `Bearer asjdhgagduahuidghaiduawgdiuwaghsgjhagdjhgdshjsgd` })
      .send({ email: random_text + "@gmail.com", password: random_text, name: random_text});

    const hasil_response = response.body;
    assert(response.body.status).to.eql('SUCCESS_REGISTER');
    assert(response.body.data).to.eql('berhasil');
    assert(response.body.message).to.eql('created user!');
    assert(hasil_response).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Register with Empty Body, Only Dictionary", async function () {
    let random_pass = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")
      .send({ });
    const hasil_response = response.body;
    assert(response.status).to.eql(500);
  });

  it("Verify Failed Register with Empty Password", async function () {
    let random_email = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")
      .send({ email: random_email + "@gmail.com", password: "", name: random_email });
    const hasil_response = response.body;
    assert(response.body.status).to.eql('FAILED_REGISTER');
    assert(response.body.data).to.eql('Email/Username/Password tidak boleh kosong');
    assert(hasil_response).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Register with Empty Email", async function () {
    let random_email = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")
      .send({ email: "", password: "testerjago", name: random_email });
    const hasil_response = response.body;
    assert(response.body.status).to.eql('FAILED_REGISTER');
    assert(response.body.data).to.eql('Email/Username/Password tidak boleh kosong');
    assert(hasil_response).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Register with Empty Name", async function () {
    let random_email = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")
      .send({ email: random_email + "@gmail.com", password: "testerjago", name: "" });
    const hasil_response = response.body;
    assert(response.body.status).to.eql('FAILED_REGISTER');
    assert(response.body.data).to.eql('Email/Username/Password tidak boleh kosong');
    assert(hasil_response).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Register with Symbol in Name Field", async function () {
    let random_email = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")
      .send({ email: random_email + "@gmail.com", password: "testerjago", name: random_email + "&#" });
    const hasil_response = response.body;
    assert(response.body.status).to.eql('FAILED_REGISTER');
    assert(response.body.data).to.eql('Nama atau password tidak valid');
    assert(hasil_response).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Register with Symbol in Email Field", async function () {
    let random_email = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")
      .send({ email: "#$$$$$", password: "testerjago", name: random_email });
    const hasil_response = response.body;
    assert(response.body.status).to.eql('FAILED_REGISTER');
    assert(hasil_response).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Register with SQLI in Password Field", async function () {
    let random_email = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")
      .send({ email: random_email + "@gmail.com", password: "SELECT", name: random_email });
    const hasil_response = response.body;
    assert(response.body.status).to.eql('FAILED_REGISTER');
    assert(response.body.data).to.eql('Nama atau password tidak valid');
    assert(hasil_response).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Register with SQLI in Email Field", async function () {
    let random_email = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")
      .send({ email: "SELECT id FROM users WHERE username='username' AND password='password' OR 1=1", password: "testerjago", name: random_email });
    const hasil_response = response.body;
    assert(response.body.status).to.eql('FAILED_REGISTER');
    assert(hasil_response).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Register with SQLI in Name Field", async function () {
    let random_email = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")
      .send({ email: random_email + "@gmail.com", password: "testerjago", 
              name: "SELECT%count%(*)%FROM%Users%WHERE%Username='jebol'%or%1=1%--%'%AND%Password=%'email'" });
    const hasil_response = response.body;
    assert(response.body.status).to.eql('FAILED_REGISTER');
    assert(hasil_response).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Register with Body Email Only", async function () {
    let random_email = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")
      .send({ email: random_email + "@gmail.com" });

    assert(response.status).to.eql(500);
  });

  it("Verify Failed Register with Body Name Only", async function () {
    let random_name = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")
      .send({ name: random_name});

    assert(response.status).to.eql(500);
  });

  it("Verify Failed Register with Body Password Only", async function () {
    let random_pass = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")
      .send({ password: random_pass});

    assert(response.status).to.eql(500);
  });

  it("Verify Failed Register with Max Char in Email Field", async function () {
    let random_email = Array.from(Array(55), () => Math.floor(Math.random() * 36).toString(36)).join('');
    let random_pass = Array.from(Array(11), () => Math.floor(Math.random() * 36).toString(36)).join('');
    const response = await request_url
      .post("/register")
      .send({ email: random_email + "@gmail.com", password: random_pass, name: random_email });
    const hasil_response = response.body;
    assert(response.body.status).to.eql('FAILED_REGISTER');
    assert(response.body.data).to.eql('Email/Username/Password melebihin maksimal karakter');
    assert(hasil_response).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Register with Max Char in Password Field", async function () {
    let random_email = Array.from(Array(10), () => Math.floor(Math.random() * 36).toString(36)).join('');
    let random_pass = Array.from(Array(38), () => Math.floor(Math.random() * 36).toString(36)).join('');
    const response = await request_url
      .post("/register")
      .send({ email: random_email + "@gmail.com", password: random_pass, name: random_email });
    const hasil_response = response.body;
    assert(response.body.status).to.eql('FAILED_REGISTER');
    assert(response.body.data).to.eql('Email/Username/Password melebihin maksimal karakter');
    assert(hasil_response).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Register without Body", async function () {
    let random_pass = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")

    assert(response.status).to.eql(500);
  });

  it("Verify Failed Register with Method GET", async function () {
    let random_text = Math.random().toString(36).substring(7);
    const response = await request_url
      .get("/register")
      .send({ email: random_text + "@gmail.com", password: random_text, name: random_text, ip_address: "127.0.0.1" });

    assert(response.status).to.eql(405);
  });

  it("Verify Failed Register with Method PUT", async function () {
    let random_text = Math.random().toString(36).substring(7);
    const response = await request_url
      .put("/register")
      .send({ email: random_text + "@gmail.com", password: random_text, name: random_text, ip_address: "127.0.0.1" });


    assert(response.status).to.eql(405);
  });

  it("Verify Failed Register with Method PATCH", async function () {
    let random_text = Math.random().toString(36).substring(7);
    const response = await request_url
      .patch("/register")
      .send({ email: random_text + "@gmail.com", password: random_text, name: random_text, ip_address: "127.0.0.1" });


    assert(response.status).to.eql(405);
  });

  it("Verify Failed Register with Form-Data as Body", async function () {
    let random_text = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")
      .type('form')
      .send({ email: random_text + "@gmail.com", password: random_text, name: random_text});

    assert(response.status).to.eql(500);
  });

  it("Verify Failed Register with xx-www-form-urlencoded as Body", async function () {
    let random_text = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")
      .set('content-Type', 'application/x-www-form-urlencoded')
      .send({ email: random_text + "@gmail.com", password: random_text, name: random_text});

    assert(response.status).to.eql(500);
  });

  it("Verify Failed Register with Integer Type in Email", async function () {
    let random_text = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")
      .send({ email: 123456789, password: random_text, name: random_text});

    assert(response.status).to.eql(500);
  });

  it("Verify Failed Register with Integer Type in Name", async function () {
    let random_text = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")
      .send({ email: random_text + "@gmail.com", password: random_text, name: 123456789});

    assert(response.status).to.eql(500);
  });

  it("Verify Failed Register with Integer Type in Password", async function () {
    let random_text = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")
      .send({ email: random_text + "@gmail.com", password: 123456789, name: random_text});

    const hasil_response = response.body;
    assert(response.status).to.eql(500);
  });

  it("Verify Failed Register with Integer Type in Email Start with 0", async function () {
    let random_text = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")
      .send({ email: 08123456789, password: random_text, name: random_text});

    const hasil_response = response.body;
    assert(response.status).to.eql(500);
  });

  it("Verify Failed Register with Integer Type in Name Start with 0", async function () {
    let random_text = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")
      .send({ email: random_text + "@gmail.com", password: random_text, name: 08123456789});

    const hasil_response = response.body;
    assert(response.status).to.eql(500);
  });

  it("Verify Failed Register with Integer Type in Password Start with 0", async function () {
    let random_text = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")
      .send({ email: random_text + "@gmail.com", password: 08123456789, name: random_text});

    const hasil_response = response.body;
    assert(response.status).to.eql(500);
  });

  it("Verify Failed Register with Existing Registered Email Gmail", async function () {
    const response = await request_url
      .post("/register")
      .send({ email: "tester@gmail.com", password: "aditya.qa", name: "Test Email Gmail"});
    const hasil_response = response.body;
    assert(response.body.status).to.eql('FAILED_REGISTER');
    assert(response.body.data).to.eql('Email sudah terdaftar, gunakan Email lain');
    assert(hasil_response).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Register with (.) in Existing Registered Email Gmail", async function () {
    const response = await request_url
      .post("/register")
      .send({ email: "tes.ter@gmail.com", password: "aditya.qa", name: "Test Email Gmail" });
    const hasil_response = response.body;
    assert(response.body.status).to.eql('FAILED_REGISTER');
    assert(response.body.data).to.eql('Email sudah terdaftar, gunakan Email lain');
    assert(hasil_response).to.include.keys("data", "message", "status"); 
  });
});