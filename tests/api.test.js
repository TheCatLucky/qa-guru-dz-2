import { expect } from '@playwright/test';
import open from 'open';
import { test, apiUrl, TodoBuilder } from '../src/helpers/index';

test('1. Получить токен', { tag: '@post' }, async ({ api }) => {
  const { status, headers } = await api.challenger.post();

  expect(status).toBe(201);
  expect(headers).toHaveProperty('x-challenger');
  expect(headers).toHaveProperty('location');
});

test.describe('Все тесты', () => {
  test.beforeAll(async({ api }) => {
    const { status, headers } = await api.challenger.post();
    token = headers['x-challenger'];
  });

  test('2. Получить список челленджей', { tag: '@get' }, async ({ api }) => {
    const { status, body } = await api.challenges.get(token);

    expect(status).toBe(200);
    expect(body.challenges).toHaveLength(67);

    for (const challenge of body.challenges) {
      expect(Object.keys(challenge).sort()).toEqual(['description', 'id', 'name', 'status',]);

      expect(challenge).toEqual({
        id: expect.any(Number),
        name: expect.any(String),
        description: expect.any(String),
        status: expect.any(Boolean)
      });
    }
  });

  test.describe('Получить список задач', () => {
    test('25. в формате XML', { tag: '@get' }, async ({ api }) => {
      const requestHeaders = {
        Accept: 'application/xml'
      };

      const { status, headers, body } = await api.todoList.get({
        token,
        requestHeaders
      });

      expect(status).toBe(200);
      expect(headers['content-type']).toContain('application/xml');
      expect(body).toContain('<todos>');
      expect(body).toContain('<todo>');
      expect(body).toContain('<id>');
      expect(body).toContain('<title>');
      expect(body).toContain('<doneStatus>');
      expect(body).toContain('<description/');
    });

    test('26. в формате JSON', { tag: '@get' }, async ({ api }) => {
      const requestHeaders = {
        Accept: 'application/json'
      };

      const { status, headers, body } = await api.todoList.get({
        token,
        requestHeaders
      });

      expect(status).toBe(200);
      expect(headers['content-type']).toContain('application/json');
      expect(body.todos).toHaveLength(10);

      for (const todo of body.todos) {
        expect(Object.keys(todo).sort()).toEqual(['description', 'doneStatus', 'id', 'title',]);

        expect(todo).toEqual({
          id: expect.any(Number),
          title: expect.any(String),
          doneStatus: expect.any(Boolean),
          description: expect.any(String)
        });
      }
    });

    test('27. без параметров', { tag: '@get' }, async ({ api }) => {
      const { status, body } = await api.todoList.get({ token });

      expect(status).toBe(200);
      expect(body.todos).toHaveLength(10);

      for (const todo of body.todos) {
        expect(Object.keys(todo).sort()).toEqual(['description', 'doneStatus', 'id', 'title',]);

        expect(todo).toEqual({
          id: expect.any(Number),
          title: expect.any(String),
          doneStatus: expect.any(Boolean),
          description: expect.any(String)
        });
      }
    });
  });

  test.describe('Получить ошибку при вызове списка задач', () => {
    test('6. обращаясь к неверному эндпоинту', { tag: '@get' }, async ({ api }) => {
      const { status, statusText } = await api.todo.get(token);

      expect(status).toBe(404);
      expect(statusText).toBe('Not Found');
    });

    test('30. в неподдерживаемом формате', { tag: '@get' }, async ({ api }) => {
      const requestHeaders = {
        Accept: 'application/gzip'
      };

      const { status, body } = await api.todoList.get({
        token,
        requestHeaders
      });

      expect(status).toBe(406);
      expect(body.errorMessages[0]).toBe('Unrecognised Accept Type');
    });
  });

  test.describe('Работа с задачей', () => {
    const createdTodo = new TodoBuilder()
      .withTitle()
      .withDoneStatus(false)
      .withDescription()
      .build();

    test('9. Создать задачу', { tag: '@post' }, async ({ api }) => {
      const { status, body } = await api.todoList.post({
        token,
        data: createdTodo
      });

      createdTodo.id = body.id;

      expect(status).toBe(201);
      expect(body.id).toEqual(expect.any(Number));

      for (const key of Object.keys(createdTodo)) {
        expect(body[key]).toBe(createdTodo[key]);
      }
    });

    test('5. Получить созданную задачу', { tag: '@get' }, async ({ api }) => {
      const { status, body } = await api.todoList.getById({
        token,
        id: createdTodo.id
      });

      expect(status).toBe(200);
      expect(body).toHaveProperty('todos');
      expect(body.todos).toHaveLength(1);

      const receivedTodo = body.todos[0];

      expect(receivedTodo).toEqual(createdTodo);
    });

    test('17. Завершить созданную задачу', { tag: '@post' }, async ({ api }) => {
      const data = new TodoBuilder()
        .withDoneStatus(true)
        .build();

      const { status, body } = await api.todoList.postById({
        token,
        id: createdTodo.id,
        data
      });

      expect(status).toBe(200);
      expect(body.doneStatus).toBe(true);
    });

    test('7. Получить список завершенных задач', { tag: '@get' }, async ({ api }) => {
      const urlParams = new TodoBuilder()
        .withDoneStatus(true)
        .build();

      const { status, body } = await api.todoList.get({
        token,
        urlParams
      });

      expect(status).toBe(200);

      for (const todo of body.todos) {
        expect(todo.doneStatus).toBe(true);
      }
    });

    test('19. Отредактировать все поля созданной задачи', { tag: '@put' }, async ({ api }) => {
      const data = new TodoBuilder()
        .withTitle()
        .withDoneStatus()
        .withDescription()
        .build();

      const { status, body } = await api.todoList.putById({
        token,
        id: createdTodo.id,
        data
      });

      expect(status).toBe(200);
      expect(body.id).toEqual(createdTodo.id);

      for (const key of Object.keys(data)) {
        expect(body[key]).toBe(data[key]);
      }
    });

    test('20. Отредактировать одно поле созданной задачи', { tag: '@put' }, async ({ api }) => {
      const data = new TodoBuilder()
        .withTitle()
        .build();

      const { status, body } = await api.todoList.putById({
        token,
        id: createdTodo.id,
        data
      });

      expect(status).toBe(200);
      expect(body.id).toEqual(createdTodo.id);
      expect(body.title).toEqual(data.title);
    });

    test('23. Удалить созданную задачу', { tag: '@delete' }, async ({ api }) => {
      const { status } = await api.todoList.delete({
        token,
        id: createdTodo.id
      });

      expect(status).toBe(204);
    });

    test('6. Попытаться получить удаленную задачу', { tag: '@get' }, async ({ api }) => {
      const { status, statusText, body } = await api.todoList.getById({
        token,
        id: createdTodo.id
      });

      expect(status).toBe(404);
      expect(statusText).toBe('Not Found');
      expect(body.errorMessages[0]).toBe(`Could not find an instance with todos/${createdTodo.id}`);
    });

    test('18. Попытаться отредактировать удаленную задачу', { tag: '@post' }, async ({ api }) => {
      const data = new TodoBuilder()
        .withTitle()
        .build();

      const { status, body } = await api.todoList.postById({
        token,
        id: createdTodo.id,
        data
      });

      expect(status).toBe(404);
      expect(body.errorMessages[0]).toBe(`No such todo entity instance with id == ${createdTodo.id} found`);
    });
  });

  test.describe('Создать задачу', () => {
    test('13. с заголовком длиной 50 символов и описанием длиной 200 символов', { tag: '@post' }, async ({ api }) => {
      const data = new TodoBuilder()
        .withTitle({ length: 50 })
        .withDoneStatus()
        .withDescription({ length: 200 })
        .build();

      const { status, body } = await api.todoList.post({
        token,
        data
      });

      expect(status).toBe(201);
      expect(body.id).toEqual(expect.any(Number));

      for (const key of Object.keys(data)) {
        expect(body[key]).toBe(data[key]);
      }
    });

    test('42. в формате JSON и получить ответ в формате XML', { tag: '@post' }, async ({ api }) => {
      const requestHeaders = {
        'Content-Type': 'application/json',
        Accept: 'application/xml'
      };
      const data = new TodoBuilder()
        .withTitle()
        .withDoneStatus()
        .withDescription()
        .build();

      const { status, headers, body } = await api.todoList.post({
        token,
        requestHeaders,
        data
      });

      expect(status).toBe(201);
      expect(headers['content-type']).toContain('application/xml');
      expect(body).toContain('<title>');
      expect(body).toContain(data.title);
      expect(body).toContain('<doneStatus>');
      expect(body).toContain(data.doneStatus.toString());
      expect(body).toContain('<description');
      expect(body).toContain(data.description);
    });

    test('43. в формате JSON и получить ответ в формате JSON', { tag: '@post' }, async ({ api }) => {
      const requestHeaders = {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      };
      const data = new TodoBuilder()
        .withTitle()
        .withDoneStatus()
        .withDescription()
        .build();

      const { status, headers, body } = await api.todoList.post({
        token,
        requestHeaders,
        data
      });

      expect(status).toBe(201);
      expect(headers['content-type']).toContain('application/json');
      expect(body.id).toEqual(expect.any(Number));

      for (const key of Object.keys(data)) {
        expect(body[key]).toBe(data[key]);
      }
    });
  });

  test.describe('Создать задачу с ошибкой в', () => {

    test('10. статусе', { tag: '@post' }, async ({ api }) => {
      const data = new TodoBuilder()
        .withTitle()
        .withDoneStatus('done')
        .withDescription()
        .build();

      const { status, body } = await api.todoList.post({
        token,
        data
      });

      expect(status).toBe(422);
      expect(body.errorMessages[0]).toBe('Failed Validation: doneStatus should be BOOLEAN but was STRING');
    });

    test('11. заголовке, превышающим 50 символов', { tag: '@post' }, async ({ api }) => {
      const data = new TodoBuilder()
        .withTitle({ length: 51 })
        .withDoneStatus()
        .withDescription()
        .build();

      const { status, body } = await api.todoList.post({
        token,
        data
      });

      expect(status).toBe(422);
      expect(body.errorMessages[0]).toBe('Failed Validation: Maximum allowable length exceeded for title - maximum allowed is 50');
    });

    test('12. описании, превышающим 200 символов', { tag: '@post' }, async ({ api }) => {
      const data = new TodoBuilder()
        .withTitle()
        .withDoneStatus()
        .withDescription({ length: 201 })
        .build();

      const { status, body } = await api.todoList.post({
        token,
        data
      });

      expect(status).toBe(422);
      expect(body.errorMessages[0]).toBe('Failed Validation: Maximum allowable length exceeded for description - maximum allowed is 200');
    });

    test('14. теле запроса, превышающим 5000 символов', { tag: '@post' }, async ({ api }) => {
      const data = new TodoBuilder()
        .withTitle()
        .withDoneStatus()
        .withDescription({ length: 5000 })
        .build();

      const { status, body } = await api.todoList.post({
        token,
        data
      });

      expect(status).toBe(413);
      expect(body.errorMessages[0]).toBe('Error: request body too large, max allowed is 5000 bytes');
    });

    test('15. несуществующем полем randomField', { tag: '@post' }, async ({ api }) => {
      const data = new TodoBuilder()
        .withTitle()
        .withDoneStatus()
        .withDescription()
        .withRandomField()
        .build();

      const { status, body } = await api.todoList.post({
        token,
        data
      });

      expect(status).toBe(422);
      expect(body.errorMessages[0]).toBe('Failed Validation: Could not find field: randomField');
    });

    test('16. HTTP-методе', { tag: '@put' }, async ({ api }) => {
      const { id, ...data } = new TodoBuilder()
        .withId({
          min: 20,
          max: 100
        })
        .withTitle()
        .withDoneStatus()
        .withDescription()
        .build();

      const { status, statusText } = await api.todoList.putById({
        token,
        id,
        data
      });

      expect(status).toBe(422);
      expect(statusText).toBe('Unprocessable Entity');
    });

    test('33. формате контента', { tag: '@post' }, async ({ api }) => {
      const requestHeaders = {
        'Content-Type': 'TLC'
      };
      const data = new TodoBuilder()
        .withTitle()
        .withDoneStatus()
        .withDescription()
        .build();

      const { status, body } = await api.todoList.post({
        token,
        requestHeaders,
        data
      });

      expect(status).toBe(415);
      expect(body.errorMessages[0]).toBe('Unsupported Content Type - tlc');
    });
  });

  test('62. Удалить все задачи', { tag: '@delete' }, async ({ api }) => {
    let body;

    ({ body } = await api.todoList.get({ token }));

    const ids = body.todos.map(({ id }) => id);

    for (const id of ids) {
      const { status } = await api.todoList.delete({
        token,
        id
      });
      expect(status).toBe(204);
    }

    ({ body } = await api.todoList.get({ token }));

    expect(body.todos).toHaveLength(0);
  });

  test.describe('Healthcheck сервера', () => {
    test('44. Неподдерживаемый HTTP-метод возвращает статус 405', { tag: '@delete' }, async ({ api }) => {
      const { status, statusText } = await api.heartbeat.delete(token);

      expect(status).toBe(405);
      expect(statusText).toBe('Method Not Allowed');
    });

    test('45. При внутренней ошибке возвращается статус 500', { tag: '@patch' }, async ({ api }) => {
      const { status, statusText } = await api.heartbeat.patch(token);

      expect(status).toBe(500);
      expect(statusText).toBe('Internal Server Error');
    });

    test('48. Слишком длинный токен', { tag: '@get' }, async ({ api }) => {
      const { status, statusText } = await api.heartbeat.get(
        new Array(10)
          .fill(token)
          .toString()
      );

      expect(status).toBe(431);
      expect(statusText).toBe('Request Header Fields Too Large');
    });
  });
});
