const http = require("http");

const port = Number(process.env.PLAYWRIGHT_ADMIN_API_PORT || 3201);
const requests = [];

const templates = [
  {
    id: 1,
    locale: "ja",
    name: "GM再提出依頼",
    subject: "【GM再提出】修正をお願いします",
    body: "{group_name} 代表 {user_name} 様\n\n{resubmit_memo}",
    updated_at: "2026-06-21T10:00:00.000+09:00",
  },
  {
    id: 2,
    locale: "en",
    name: "GM Resubmission Request",
    subject: "GM resubmission request",
    body: "Dear {user_name},\n\n{resubmit_memo}",
    updated_at: "2026-06-21T10:00:00.000+09:00",
  },
];

const sendJson = (response, status, body, headers = {}) => {
  response.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
    ...headers,
  });
  response.end(JSON.stringify(body));
};

const readBody = (request) =>
  new Promise((resolve) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => {
      resolve(body ? JSON.parse(body) : {});
    });
  });

http
  .createServer(async (request, response) => {
    const url = new URL(request.url, `http://127.0.0.1:${port}`);

    if (request.method === "OPTIONS") {
      sendJson(response, 200, {});
      return;
    }

    if (url.pathname === "/_e2e/health") {
      sendJson(response, 200, { ok: true });
      return;
    }

    if (url.pathname === "/_e2e/requests" && request.method === "GET") {
      sendJson(response, 200, requests);
      return;
    }

    if (url.pathname === "/_e2e/requests" && request.method === "DELETE") {
      requests.length = 0;
      sendJson(response, 200, { ok: true });
      return;
    }

    if (url.pathname === "/api/v1/users/show") {
      sendJson(response, 200, {
        status: { code: 200, message: "Success" },
        data: { id: 1, role_id: 1 },
      });
      return;
    }

    if (url.pathname === "/api/auth/sign_in" && request.method === "POST") {
      sendJson(
        response,
        200,
        { data: { id: 1, role_id: 1 } },
        {
          "access-token": "e2e-token",
          client: "e2e-client",
          uid: "e2e@example.com",
          "token-type": "Bearer",
        }
      );
      return;
    }

    if (url.pathname === "/api/v1/message_templates") {
      if (request.method === "GET") {
        sendJson(response, 200, {
          status: { code: 200, message: "Success" },
          data: templates,
        });
        return;
      }

      if (request.method === "POST") {
        const payload = await readBody(request);
        requests.push({ method: "POST", path: url.pathname, payload });
        sendJson(response, 201, {
          status: { code: 201, message: "Created" },
          data: { id: 2, ...payload, updated_at: templates[0].updated_at },
        });
        return;
      }
    }

    if (url.pathname === "/api/v1/message_templates/1") {
      if (request.method === "PATCH") {
        const payload = await readBody(request);
        requests.push({ method: "PATCH", path: url.pathname, payload });
        sendJson(response, 200, {
          status: { code: 200, message: "Success" },
          data: { ...templates[0], ...payload },
        });
        return;
      }
    }

    if (url.pathname === "/api/v1/message_templates/1/copy_source") {
      sendJson(response, 200, {
        status: { code: 200, message: "Success" },
        data: {
          locale: "ja",
          name: "GM再提出依頼のコピー",
          subject: "【GM再提出】修正をお願いします",
          body: "{group_name} 代表 {user_name} 様\n\n{resubmit_memo}",
        },
      });
      return;
    }

    if (url.pathname === "/api/v1/message_templates/2/copy_source") {
      sendJson(response, 200, {
        status: { code: 200, message: "Success" },
        data: {
          locale: "en",
          name: "GM Resubmission Request copy",
          subject: "GM resubmission request",
          body: "Dear {user_name},\n\n{resubmit_memo}",
        },
      });
      return;
    }

    if (url.pathname === "/api/v1/get_group_show_for_admin_view/1") {
      sendJson(response, 200, {
        status: { code: 200, message: "Success" },
        data: {
          group: {
            id: 1,
            name: "技大祭企画",
            project_name: "食品販売",
          },
          user: {
            name: "山田太郎",
            email: "representative@example.com",
          },
        },
      });
      return;
    }

    if (url.pathname === "/api/v1/get_health_center_submission_status_show_for_admin_view/1") {
      sendJson(response, 200, {
        status: { code: 200, message: "Success" },
        data: {
          submissions: [
            {
              id: 1,
              application_type: "food_product",
              status: "waiting_resubmission",
              comments: [],
            },
          ],
        },
      });
      return;
    }

    if (url.pathname === "/user_page_settings/1") {
      sendJson(response, 200, {
        status: { code: 200, message: "Success" },
        data: { fes_year_id: 1 },
      });
      return;
    }

    if (url.pathname === "/api/v1/get_health_center_submission_status_index_for_admin_view") {
      sendJson(response, 200, {
        status: { code: 200, message: "Success" },
        data: [
          {
            group: { id: 1, fes_year_id: 1 },
            group_category: 1,
            fes_year: { id: 1 },
          },
        ],
      });
      return;
    }

    if (
      [
        "/food_products/group/1",
        "/cooking_process_orders/group/1",
        "/employees/group/1",
        "/rental_orders/group/1",
        "/shops",
        "/rental_items",
        "/un_registered_groups",
      ].includes(url.pathname)
    ) {
      sendJson(response, 200, {
        status: { code: 200, message: "Success" },
        data: [],
      });
      return;
    }

    if (url.pathname === "/venue_maps/group/1") {
      sendJson(response, 404, { error: "Not found" });
      return;
    }

    if (
      url.pathname ===
        "/api/v1/create_health_center_submission_status_comment" &&
      request.method === "POST"
    ) {
      const payload = await readBody(request);
      requests.push({ method: "POST", path: url.pathname, payload });
      sendJson(response, 201, {
        status: { code: 201, message: "Created" },
        data: {
          id: 1,
          commentable_id: 1,
          body: payload.body,
          created_at: "2026-06-21T10:00:00.000+09:00",
        },
      });
      return;
    }

    if (url.pathname === "/api/v1/mail_deliveries" && request.method === "POST") {
      const payload = await readBody(request);
      requests.push({ method: "POST", path: url.pathname, payload });
      sendJson(response, 200, {
        status: { code: 200, message: "Success" },
        data: [],
      });
      return;
    }

    sendJson(response, 404, { error: "Not found" });
  })
  .listen(port, "127.0.0.1");
