import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from "sequelize-typescript";
import UserEntity from "./user";
import PageEntity from "./page";

@Table({ tableName: "Document" })
export default class DocumentEntity extends Model<Partial<DocumentEntity>> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;
  @Column(DataType.STRING)
  name!: string;
  @Column(DataType.STRING)
  title!: string;
  @Column(DataType.TEXT)
  content?: string;
  @Column(DataType.STRING)
  description?: string;
  @Column(DataType.INTEGER)
  numPages!: number; // set it here to avoid calculate column or view at this moment
  @Column(DataType.STRING)
  url?: string;
  @Column(DataType.STRING)
  type!: string;
  @Column(DataType.BOOLEAN)
  isActive!: boolean;

  /* Blamed fields */
  @CreatedAt
  createdOn!: Date;
  @Column(DataType.STRING)
  createdBy!: string;
  @UpdatedAt
  modifiedOn?: Date;
  @Column(DataType.STRING)
  modifiedBy!: string;
  @DeletedAt
  deletionDate?: Date;
  /* End blamed fields */

  /* ForeignKey Fields*/
  @Column(DataType.INTEGER)
  @ForeignKey(() => UserEntity)
  userId!: number;

  /* Relationships*/
  @BelongsTo(() => UserEntity)
  user!: UserEntity;

  @HasMany(() => PageEntity)
  pages: PageEntity[] = [];
  /* End relationships*/
}
