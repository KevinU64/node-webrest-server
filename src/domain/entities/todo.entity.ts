


export class TodoEntity {
    
    constructor(
        public id: number,
        public text: string,
        public createdAt?: Date|null
    ){}

    get isCompleted() {
        return !!this.createdAt;
    }

    public static fromObject( object: {[key: string]: any} ): TodoEntity {
        const { id, text, createdAt } = object;
        if ( !id ) throw 'Id is required';
        if ( !text ) throw 'Text is required';

        let newCreatedAt;
        if ( createdAt ) {
            newCreatedAt = new Date( createdAt );
            if( isNaN( newCreatedAt.getTime() ) ) {
                throw 'CompletedAt is not a valid date';
            }
        }

        return new TodoEntity( id, text, createdAt );

    }
}

