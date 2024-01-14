import request from 'supertest';
import { testServer } from '../../test_server';
import { prisma } from '../../../src/data/postgres';


describe('Todo route testing', () => {
    
    beforeAll( async() => {
        await testServer.start();
    });
    
    afterAll(() => {
        testServer.close();
    });
    
    beforeEach( async() => {
        await prisma.todo.deleteMany();
    });
    
    const todo1 = { text: 'Todo 1' };
    const todo2 = { text: 'Todo 2' };
    const todoId = 999;

    test('Should return TODOs api/todos', async() => {
        
        await prisma.todo.createMany({
            data: [ todo1, todo2 ]
        });

        const { body } = await request( testServer.app )
            .get('/api/todos')
            .expect(200);

        expect( body ).toBeInstanceOf( Array );
        expect( body.length ).toBe(2);
        expect( body[0].text ).toBe( todo1.text );
        expect( body[1].text ).toBe( todo2.text );
        expect( body[0].createdAt ).toBeNull();

    })

    test('Should return a TODO api/todos/:id', async() => {

        const todo = await prisma.todo.create({ data: todo1 })

        const { body } = await request( testServer.app )
            .get(`/api/todos/${todo.id}`)
            .expect(200);

        expect( body ).toEqual({
            id: todo.id,
            text: todo.text,
            createdAt: todo.createdAt,
        });

    });

    test('Should return a 404 Not Found api/todos/:id', async() => {

        const { body } = await request( testServer.app )
            .get(`/api/todos/${ todoId }`)
            .expect(404)

        expect( body ).toEqual({ error: `Todo with id ${ todoId } not found` });

    });

    test('Should return a new Todo api/todos', async() =>{

        const { body } = await request( testServer.app )
            .post('/api/todos')
            .send( todo1 )
            .expect( 201 )

        expect(body).toEqual({
            id: expect.any(Number),
            text: todo1.text,
            createdAt: null
        });    
    });

    test('Should return an error if text is not present api/todos', async() => {

        const { body } = await request( testServer.app )
            .post('/api/todos')
            .send({ })
            .expect(400);

        // console.log(body)
        expect( body ).toEqual({ error: 'Text property is required' });
    });

    test('Should return an error if text is empty api/todos', async() => {

        const { body } = await request( testServer.app )
            .post('/api/todos')
            .send({ text: '' })
            .expect(400);

        expect( body ).toEqual({ error: 'Text property is required' });
    });

    test('Should return an updated TODO api/todos/:id', async() => {

        const todo = await prisma.todo.create({ data: todo1 })

        const { body } = await request( testServer.app )
            .put(`/api/todos/${ todo.id }`)
            .send({ text: 'Hola mundo UPDATED', createdAt: '2023-10-21' })
            .expect(200);

        expect(body).toEqual({
            id: expect.any(Number),
            text: 'Hola mundo UPDATED',
            createdAt: "2023-10-21T00:00:00.000Z",
        });

    });

    test('Should return 404 if TODO not found', async() => {

        const { body } = await request( testServer.app )
            .put(`/api/todos/${todoId}`)
            .send({ text: 'Hola mundo UPDATED', createdAt: '2023-10-21' })
            .expect(404)

            expect( body ).toEqual({ error: `Todo with id ${ todoId } not found` });


    });

    test('Should return an updated TODO only the date', async() => {

        const todo = await prisma.todo.create({ data: todo1 })

        const { body } = await request( testServer.app )
            .put(`/api/todos/${ todo.id }`)
            .send({ createdAt: '2024-10-21' })
            .expect(200);

        expect(body).toEqual({
            id: expect.any(Number),
            text: expect.any( String ),
            createdAt: "2024-10-21T00:00:00.000Z",
        });

    });

    test('Should delete a TODO api/todos/:id', async() => {

        const todo = await prisma.todo.create({ data: todo1 })

        const { body } = await request( testServer.app )
            .delete(`/api/todos/${ todo.id }`)
            .expect(200);

        expect(body).toEqual({
            id: expect.any(Number),
            text: todo1.text,
            createdAt: null,
        });

    });

    test('Should return 404 if TODO do not exists api/todos/:id', async() => {

        const { body } = await request( testServer.app )
            .delete(`/api/todos/${ todoId }`)
            .expect(404);

        expect(body).toEqual({ error: `Todo with id ${ todoId } not found`});

    });

})