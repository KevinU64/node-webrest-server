import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";

// const todos = [
//     { id: 1, text: 'Kevin', createdAt: new Date() },
//     { id: 2, text: 'Luis', createdAt: null },
//     { id: 3, text: 'Lucas', createdAt: new Date() },
// ];

export class TodosController {

    //* DI
    constructor() {}


    public getTodos = async(req: Request, res: Response) => {
        //? POSTGRES
        const allTodos = await prisma.todo.findMany()
        return res.json(allTodos);

        // return res.json(todos);
    }

    public getTodoById = async(req: Request, res: Response) => {
        const id = +req.params.id;
        if ( isNaN(id) ) return res.status(400).json({ error: 'ID argument is not a number' });

        //? POSTGRES
        const todo = await prisma.todo.findUnique({
            where: { id },
        });

        // const todo = todos.find( todo => todo.id === id);

        ( todo )
            ? res.json(todo)
            : res.status(404).json({ error: `TODO with id ${ id } not found` });
    
    }

    public createTodo = async (req: Request, res: Response) => {
        // const { text } = req.body;
        // if ( !text ) return res.status( 400 ).json( { error: 'Text property is required' } );

        //* DTO
        const [error, createTodoDto] = CreateTodoDto.create(req.body);
        if ( error ) return res.status(400).json({  error });


        //? POSTGRES
        const todo = await prisma.todo.create({
            data: createTodoDto!
        })

        res.json( todo );

        /*const newTodo = {
            id: todos.length +1,
            text: text,
            createdAt: null,
        };

        todos.push(newTodo);

        res.json(newTodo);*/

    }

    public updateTodo = async ( req: Request, res: Response ) => {
        const id = +req.params.id;
        const [error, updateTodoDto] = UpdateTodoDto.create({...req.body, id});
        if ( error ) return res.status(400).json({ error });
        
        //? POSTGRES
        const todo = await prisma.todo.findUnique({
            where: { id },
        });

        // const todo = todos.find( todo => todo.id === id);
        if ( !todo ) return res.status(404).json({ error: 'Todo not found' });
        
        // const { text, createdAt } = req.body; 
        // if ( !text ) return res.status(400).json({ error: 'Text property is required' });

        //? POSTGRES
        const updatedTodo = await prisma.todo.update({
            where: { id },
            data: updateTodoDto!.values,
        });

        res.json( updatedTodo );

        /*todo.text = text || todo.text;
        ( createdAt === 'null' )
            ? todo.createdAt = null
            : todo.createdAt = new Date( createdAt || todo.createdAt );

        todo.text = text;
        ! OJO, referencia
        ? Solucion 
        todos.forEach( (todo, index) => {
            if ( todo.id === id ){
                todos[index] = todo;
            }
        });*/

    }

    public delateTodo = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if ( isNaN(id) ) return res.status(400).json({ error: 'ID argument is not a number' });

        //? POSTGRES
        const todo = await prisma.todo.findUnique({
            where: { id },
        });

        
        // const todo = todos.find(todo => todo.id === id);
        if ( !todo ) return res.status(404).json({ error: `Todo with id ${ id } not found` });
        
        //? POSTGRES
        const deletedTodo = await prisma.todo.delete({
            where: { id }
        });

        ( deletedTodo )
            ? res.json( deletedTodo )
            : res.status(404).json({ error: `Todo not exists` });

        /* todos.splice( todos.indexOf(todo), 1 );
        
         res.json( {todo, deletedTodo} );*/
    }

}