# express-validator — Step-by-Step Guide Using a Todo Application

We will learn:

1. Why validation is needed
2. What express-validator actually does
3. How middleware validation flow works
4. How to validate request body
5. How to return clean validation errors
6. How to sanitize data
7. How to create reusable validators
8. How to test validation using frontend page

---

# 1. Why Validation Is Needed

Suppose frontend sends:

```json
{
  "title": "",
  "priority": "abc"
}
```

Without validation:

* bad data enters DB
* APIs become inconsistent
* app crashes become possible
* security risks increase

Validation protects backend at API boundary.

---

# 2. Install express-validator

```bash
npm install express-validator
```

---

# 3. Basic Express Server Setup

Create:

```txt
server.js
```

```js
const express = require("express");
const { body, validationResult } = require("express-validator");

const app = express();

app.use(express.json());

const todos = [];

app.post(
  "/todos",

  // Validation Middleware
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium, or high"),

  // Controller
  (req, res) => {

    const errors = validationResult(req);

    // Validation Failed
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Create Todo
    const todo = {
      id: todos.length + 1,
      title: req.body.title,
      priority: req.body.priority || "low"
    };

    todos.push(todo);

    res.status(201).json({
      success: true,
      data: todo
    });
  }
);

app.get("/todos", (req, res) => {
  res.json({
    success: true,
    data: todos
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

---

# 4. Understanding The Validation Flow

Suppose frontend sends:

```json
{
  "title": "Hi",
  "priority": "urgent"
}
```

Request lifecycle:

```txt
Request
↓
express.json()
↓
Validation Middleware
↓
validationResult(req)
↓
If invalid → 400 response
↓
If valid → controller runs
↓
Todo stored
↓
Response sent
```

---

# 5. What body("title") Actually Means

```js
body("title")
```

Means:

```txt
Validate req.body.title
```

---

# 6. Important Validators

## notEmpty()

```js
.notEmpty()
```

Rejects:

```txt
""
null
undefined
```

---

## isLength()

```js
.isLength({ min: 3 })
```

Checks string length.

---

## isEmail()

```js
body("email").isEmail()
```

Checks valid email format.

---

## isIn()

```js
.isIn(["low", "medium", "high"])
```

Only allows specific values.

---

## optional()

```js
.optional()
```

Field becomes optional.

Validation only runs if field exists.

---

# 7. What trim() Does

```js
.trim()
```

Removes extra spaces.

Example:

```txt
"   hello   "
```

becomes:

```txt
"hello"
```

This is sanitization.

---

# 8. validationResult(req)

MOST important function.

```js
const errors = validationResult(req);
```

It collects all validation errors from middleware.

---

# 9. Example Error Response

If request invalid:

```json
{
  "success": false,
  "errors": [
    {
      "type": "field",
      "msg": "Title must be at least 3 characters",
      "path": "title",
      "location": "body"
    }
  ]
}
```

---

# 10. Testing Using Postman

## Valid Request

```http
POST http://localhost:3000/todos
```

Body:

```json
{
  "title": "Learn Express Validator",
  "priority": "high"
}
```

---

## Invalid Request

```json
{
  "title": "",
  "priority": "urgent"
}
```

---

# 11. Frontend Test Page

Create:

```txt
public/index.html
```

```html
<!DOCTYPE html>
<html>
<head>
  <title>Todo Validation Test</title>
</head>
<body>

  <h1>Create Todo</h1>

  <form id="todoForm">

    <input
      type="text"
      id="title"
      placeholder="Todo Title"
    />

    <select id="priority">
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
      <option value="urgent">Invalid Option</option>
    </select>

    <button type="submit">
      Create Todo
    </button>

  </form>

  <pre id="result"></pre>

  <script>

    const form = document.getElementById("todoForm");
    const result = document.getElementById("result");

    form.addEventListener("submit", async (e) => {

      e.preventDefault();

      const title = document.getElementById("title").value;
      const priority = document.getElementById("priority").value;

      const response = await fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          priority
        })
      });

      const data = await response.json();

      result.textContent = JSON.stringify(data, null, 2);

    });

  </script>

</body>
</html>
```

---

# 12. Serve Frontend Page

Add this in server.js:

```js
app.use(express.static("public"));
```

Place it BEFORE routes.

---

# 13. Run Application

```bash
node server.js
```

Open:

```txt
http://localhost:3000
```

Now test:

* valid title
* empty title
* invalid priority

You will see validation errors returned from backend.

---

# 14. Most Important Backend Understanding

Validation middleware runs BEFORE controller.

Meaning:

```txt
Bad requests never reach business logic.
```

This is one of the most important backend architecture principles.

---

# 15. Real Production Folder Structure

As application grows:

```txt
middlewares/
validators/
routes/
controllers/
services/
```

Example:

```txt
validators/
   todoValidator.js
```

---

# 16. Reusable Validator Example

Create:

```txt
validators/todoValidator.js
```

```js
const { body } = require("express-validator");

exports.createTodoValidator = [

  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Invalid priority")

];
```

---

# 17. Cleaner Route Using Validator

```js
const {
  createTodoValidator
} = require("./validators/todoValidator");

app.post(
  "/todos",
  createTodoValidator,
  (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    res.send("Todo Created");
  }
);
```

---

# 18. Important Production Best Practices

## Always validate:

* body
* params
* query
* headers

---

## Never trust frontend validation alone

Frontend validation improves UX.

Backend validation ensures security.

Both are required.

---

# 19. Common Validation Middleware Types

| Validation | Example     |
| ---------- | ----------- |
| body()     | req.body    |
| param()    | req.params  |
| query()    | req.query   |
| header()   | req.headers |

---

# Example Param Validation

```js
const { param } = require("express-validator");

param("id")
  .isInt()
  .withMessage("ID must be integer")
```

---

# Example Query Validation

```js
const { query } = require("express-validator");

query("page")
  .isInt({ min: 1 })
```

---

# 20. Golden Mental Model

```txt
Request
↓
Validation Middleware
↓
Bad Request Rejected
↓
Controller Executes Only If Safe
```

This is how professional backends protect APIs.
