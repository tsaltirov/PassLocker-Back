//import { Product } from '../../products/entities';
import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToMany, CreateDateColumn } from 'typeorm';

@Entity('users') //ponemos el nombre 'users'
export class User {

    @PrimaryGeneratedColumn('uuid') //si no pongo el uuid, sería una secuencia de números tal cual
    id: string; //es mejor utilizar un id único que no vaya a cambiar desde su creación. El correo electrónico no es un identificador único porque puede cambiar.

    @Column( 'text', {
        unique: true,
    })
    email: string;

    @Column('text', {
        select: false,
    })
    password: string;

    @Column('text')
    fullName: string;

    
    @Column('text', {
        default: 'individual' //Tipos: individual, profesional, pyme, organización
    })
    userType: string;
    
    @Column('bool', {
        default: false,
        name: 'is_active',
    })
    isActive: boolean;

    @Column({ 
        type: 'uuid', 
        unique: true, 
        name: 'activation_token' })
    activationToken: string;

    @Column({
        type: 'uuid',
        unique: true,
        name: 'reset_password_token',
        nullable: true,
      })
    resetPasswordToken: string;

    @CreateDateColumn({
        name: 'created_on',
    })
    createdOn: Date;

    @BeforeInsert()
    checkFieldsBeforeInsert(){
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate(){
        this.email = this.email.toLowerCase().trim();
    }

    //Todo Relación con tabla de contraseñas
/*     @OneToMany(
        //¿cómo se va a relacionar?:
        //1. Citamos la entidad con la que se relaciona, la tabla a la que quiero apuntar
        () => Product,
        //2. ¿Cómo se relaciona mi instancia de producto con esta tabla?. Ponemos el atributo o propiedad "user" que debería estar en la entidad "Product"
        (product) => product.user,
    )
    product: Product[]; */

}
