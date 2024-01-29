import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class FavCharacter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("int", { nullable: false })
  characterId: number;

  @Column("int", { nullable: false })
  userId: number;
}
