import { prisma } from "../../data/postgres";
import { CreateTodoDto, TodoDatasource, TodoEntity, UpdateTodoDto } from "../../domain";



export class TodoDatasourceImpl implements TodoDatasource {

    async create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
        const todo = await prisma.todo.create({
            data: createTodoDto!
        });

        return TodoEntity.fromObject( todo );
    }

    async getAll(): Promise<TodoEntity[]> {
        const allTodos = await prisma.todo.findMany();

        return allTodos.map( todo => TodoEntity.fromObject( todo ) );
    }

    async findById(id: number): Promise<TodoEntity> {
        const todo = await prisma.todo.findUnique({
            where: { id },
        });

        if( !todo ) throw `Todo with id ${ id } not found`;
        return TodoEntity.fromObject(todo);
    }

    async updateById(updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
        this.findById( updateTodoDto.id );

        const updatedTodo = await prisma.todo.update({
            where: { id: updateTodoDto.id },
            data: updateTodoDto!.values,
        });

        return TodoEntity.fromObject(updatedTodo);
    }

    async deleteById(id: number): Promise<TodoEntity> {
        this.findById( id );

        const deletedTodo = await prisma.todo.delete({
            where: { id }
        });

        return TodoEntity.fromObject( deletedTodo );
    }

}