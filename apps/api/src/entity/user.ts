import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text", { nullable: false })
  email: string;

  @Column("text", { nullable: false })
  password: string;

  @Column("text", { nullable: false })
  name: string;
}
