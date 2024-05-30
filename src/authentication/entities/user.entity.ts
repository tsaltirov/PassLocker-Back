//import { Product } from '../../products/entities';
import { ApiProperty } from '@nestjs/swagger';
import { PassHandler } from 'src/pass-handler/entities/pass-handler.entity';
import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToMany, CreateDateColumn, JoinColumn, OneToOne } from 'typeorm';

@Entity('users') //ponemos el nombre 'users'
export class User {

    @ApiProperty({
        example: 'cd533345-f1f3-48c9-a62c-7dc2da50c8f8',
        description: 'User ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid') //si no pongo el uuid, sería una secuencia de números tal cual
    id: string; //es mejor utilizar un id único que no vaya a cambiar desde su creación. El correo electrónico no es un identificador único porque puede cambiar.

    @ApiProperty({
        example: 'emailsample@gmail.com',
        description: 'User email address',
        uniqueItems: true
    })
    @Column( 'text', {
        unique: true,
    })
    email: string;
  
    @ApiProperty({
        example: 'Abc123',
        description: 'User Password',
        minLength: 6,
        maxLength: 50
    })
    @Column('text', {
        select: false,
    })
    password: string;

    @ApiProperty({
        example: 'Pedro del Hierro',
        description: 'User fullname',
        minLength: 1
    })
    @Column('text')
    fullName: string;

    @ApiProperty({
        example: 'individual',
        description: 'Type of user',
        default: 'individual'
    })
    @Column('text', {
        default: 'individual' //Tipos: individual, profesional, pyme, organización
    })
    userType: string;
    
    @ApiProperty({
        example: 'True',
        description: 'Is user active?',
        default: true
    })
    @Column('bool', {
        default: true,
        name: 'is_active',
    })
    isActive: boolean;

    /* @Column({ 
        type: 'uuid', 
        unique: true, 
        name: 'activation_token' })
    activationToken: string; */

    @ApiProperty({
        example: 'cd533345-f1f3-48c9-a62c-7dc2da50c8f8',
        description: 'Reset Password Token',
        uniqueItems: true
    })
    @Column({
        type: 'uuid',
        unique: true,
        name: 'reset_password_token',
        nullable: true,
      })
    resetPasswordToken: string;

    @Column({
        type: 'date',
        unique: false,
        name: 'Create date',
        nullable: false,
      })
    @CreateDateColumn({
        name: 'created_on',
    })
    createdOn: Date;

    //@OneToOne(() => PasswordModule)
    //@JoinColumn()
    //password_id: PasswordModule;            //relación tabla password
    

    @BeforeInsert()
    checkFieldsBeforeInsert(){
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate(){
        this.email = this.email.toLowerCase().trim();
    }

    //TODO: Relación con tabla de contraseñas
/*     @OneToMany(
        //¿cómo se va a relacionar?:
        //1. Citamos la entidad con la que se relaciona, la tabla a la que quiero apuntar
        () => Product,
        //2. ¿Cómo se relaciona mi instancia de producto con esta tabla?. Ponemos el atributo o propiedad "user" que debería estar en la entidad "Product"
        (product) => product.user,
    )
    product: Product[]; */

}
