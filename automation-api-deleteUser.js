const request_url = require("supertest")("http://barru.pythonanywhere.com");
const assert = require("chai").expect;

let random_text = Math.random().toString(36).substring(7); //generate random text
let authorize_value = ""; //global authorization with empty value

describe("POST /register then /login to get a valid authorization value", function () {
    it("Verify Success Register First", async function () {
        const response = await request_url
          .post("/register")
          .send({ email: random_text + "@gmail.com", password: random_text, name: random_text });
    });

    it("Verify Success Login", async function () { 
    const response = await request_url
        .post("/login")
        .send({ email: random_text + "@gmail.com", password: random_text });

        authorize_value = response.body.credentials.access_token; //update empty authorization with valid value
    });
});

describe("POST /delete-user", function () {
    it("Verify Failed Delete User without Authorization", async function () { 
        const response = await request_url 
            .del("/delete-user")
            .send({ password: random_text});

        assert(response.status).to.eql(500); 
    });

    it("Verify Failed Delete User with Invalid Password", async function () { 
        const response = await request_url 
            .del("/delete-user")
            .set({ Authorization: authorize_value })
            .send({ password: "sigantengnih"});

        const isi_data = response.body;

        assert(response.body.status).to.eql('FAILED_DELETE_PROFILE');
        assert(response.body.message).to.eql('Gagal Hapus Akun');
        assert(isi_data).to.include.keys("data", "message", "status"); 
    });

    it("Verify Failed Delete User with Empty String", async function () { 
        const response = await request_url 
            .del("/delete-user")
            .set({ Authorization: authorize_value })
            .send({ password: ""});

        const isi_data = response.body;

        assert(response.body.status).to.eql('FAILED_DELETE_PROFILE');
        assert(response.body.message).to.eql('Gagal Hapus Akun');
        assert(isi_data).to.include.keys("data", "message", "status"); 
    });

    it("Verify Failed Delete User with Integer value", async function () { 
        const response = await request_url 
            .del("/delete-user")
            .set({ Authorization: authorize_value })
            .send({ password: 1});

        assert(response.status).to.eql(500); 
    });

    it("Verify Failed Delete User with Max Character", async function () {
        let max_pass = Array.from(Array(40), () => Math.floor(Math.random() * 36).toString(36)).join(''); 
        const response = await request_url 
            .del("/delete-user")
            .set({ Authorization: authorize_value })
            .send({ password: max_pass});

        const isi_data = response.body;

        assert(response.body.status).to.eql('FAILED_DELETE_PROFILE');
        assert(response.body.message).to.eql('Gagal Hapus Akun');
        assert(isi_data).to.include.keys("data", "message", "status"); 
    });
    
    it("Verify Failed Delete User with Older Authorization", async function () { 
        const response = await request_url 
            .del("/delete-user")
            .set({ Authorization: '5836a5287ae73353561d307b72fe908b54bffd0a3113b708144c764dd7f5fdk2' })
            .send({ password: "sman60jakarta"});

        const isi_data = response.body;

        assert(response.body.data).to.eql("User's not found");
        assert(isi_data).to.include.keys("data", "message", "status"); 
    });

    it("Verify Failed Delete User with Empty Authorization", async function () { 
        const response = await request_url 
            .del("/delete-user")
            .set({ Authorization: '' })
            .send({ password: "sman60jakarta"});

        const isi_data = response.body;

        assert(response.body.data).to.eql("User's not found");
        assert(isi_data).to.include.keys("data", "message", "status"); 
    });

    it("Verify Failed Delete User with Bearer Authorization and valid value", async function () { 
        const response = await request_url 
            .del("/delete-user")
            .set({ Authorization: authorize_value })
            .send({ name: "sman60jakarta"});

        assert(response.status).to.eql(500);
    });

    it("Verify Failed Delete User with Bearer Authorization and valid value", async function () { 
        const response = await request_url 
            .del("/delete-user")
            .set({ Authorization: 'Bearer ' + authorize_value  })
            .send({ password: "sman60jakarta"});

        const isi_data = response.body;

        assert(response.body.data).to.eql("User's not found");
        assert(isi_data).to.include.keys("data", "message", "status"); 
    });

    it("Verify Failed Delete User with Bearer Authorization and wrong value", async function () { 
        const response = await request_url 
            .del("/delete-user")
            .set({ Authorization: 'Bearer ' + 'hahahaahhahahahahahahahahahahaa'  })
            .send({ password: "sman60jakarta"});

        const isi_data = response.body;

        assert(response.body.data).to.eql("User's not found");
        assert(isi_data).to.include.keys("data", "message", "status"); 
    });

    it("Verify Failed Delete User with GET Request", async function () { 
        const response = await request_url 
            .get("/delete-user")
            .set({ Authorization: authorize_value })
            .send({ password: random_text});

        assert(response.status).to.eql(405); 
    });

    it("Verify Failed Delete User with POST Request", async function () { 
        const response = await request_url 
            .post("/delete-user")
            .set({ Authorization: authorize_value })
            .send({ password: random_text});

        assert(response.status).to.eql(405); 
    });

    it("Verify Failed Delete User with PATCH Request", async function () { 
        const response = await request_url 
            .patch("/delete-user")
            .set({ Authorization: authorize_value })
            .send({ password: random_text});

        assert(response.status).to.eql(405); 
    });

    it("Verify Failed Delete User with empty body only dictionary", async function () { 
        const response = await request_url 
            .del("/delete-user")
            .set({ Authorization: authorize_value })
            .send({});

        assert(response.status).to.eql(500); 
    });

    it("Verify Failed Delete User with xx-www-form-urlencoded as Body", async function () { 
        const response = await request_url 
            .del("/delete-user")
            .set('content-Type', 'application/x-www-form-urlencoded')
            .set({ Authorization: authorize_value })
            .send({ password: "sman60jakarta"});

        assert(response.status).to.eql(500); 
    });

    it("Verify Failed Delete User with xx-www-form-urlencoded as Body", async function () { 
        const response = await request_url 
            .del("/delete-user")
            .type('form')
            .set({ Authorization: authorize_value })
            .send({ password: "sman60jakarta"});

        assert(response.status).to.eql(500); 
    });

    it("Verify Success Delete User", async function () { 
        const response = await request_url 
            .del("/delete-user")
            .set({ Authorization: authorize_value })
            .send({ password: random_text});

        const isi_data = response.body;

        assert(response.body.status).to.eql('SUCCESS_DELETE_PROFILE');
        assert(response.body.message).to.eql('Berhasil Hapus User');
        assert(isi_data).to.include.keys("data", "message", "status"); 
    });
});