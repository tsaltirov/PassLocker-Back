import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/authentication/entities/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToMany, ManyToOne , OneToOne, JoinColumn } from 'typeorm';



@Entity('password') //ponemos el nombre 'users'
export class PasswordModule {

    @ApiProperty({
        example: 'cd533345-f1f3-48c9-a62c-7dc2da50c8f8',
        description: 'Password ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid') //uuid para el id de la contraseña.
    id: string; //cada contraseña es individual e única.

    @ApiProperty({
        example: 'Abc123!',
        description: 'Password content',
        minLength: 6,
        maxLength: 50
    })
    password: string; //esta puede ser generada aleatoriamente o definida por el usuario, siempre se guardará encriptada por seguridad.


    @Column('text')
    description: string; //El cliente anotará con que plataforma o servicio se relaciona su contraseña.

   // @Column(() => User)
    //user_id: User;             // Relación one-to-one tabla de users.




}
