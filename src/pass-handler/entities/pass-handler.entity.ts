import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/authentication/entities/user.entity';

@Entity('passwords') //ponemos el nombre 'passwords'
export class PassHandler {

    @ApiProperty({
        example: 'cd533345-f1f3-48c9-a62c-7dc2da50c8f8',
        description: 'Password ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid') //uuid para el id de la contraseña.
    id: string; //cada contraseña es individual e única.
    
    @Column('text')
    userService: string; //El cliente anotará con que plataforma o servicio se relaciona su contraseña.

    @Column('text')
    userName: string; //El cliente anotará con que plataforma o servicio se relaciona su contraseña.

    @ApiProperty({
        example: 'Abc123!',
        description: 'Password content',
        minLength: 6,
        maxLength: 50
    })
    password: string; //esta puede ser generada aleatoriamente o definida por el usuario, siempre se guardará encriptada por seguridad.

    @ManyToOne(
        //1. Citamos la entidad con la que se relaciona, la tabla a la que quiero apuntar
       () => User,
        //2. Relaciona instancia de User con Password. Ponemos el atributo o propiedad "passwords" que está en la entidad "User"
       (user) => user.passwords,
       //Esto hará que cada vez que se haga una consulta de passwords, cargue automáticamente la relación
       { eager: true }
    )
    user: User




}
