import { BaseEntity, Column, Entity } from 'typeorm';

@Entity({ name: 'profiles' })
export class EscortProfile extends BaseEntity {
  @Column({ name: 'id', primary: true })
  id: string;

  @Column({ name: 'escortid' })
  escortId: string;

  @Column({ name: 'firstname' })
  firstName: string;

  @Column({ name: 'lastname' })
  lastName: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'phonenumber' })
  phoneNumber: string;

  @Column({ name: 'gender' })
  gender: string;

  @Column({ name: 'nationalityid' })
  nationalityId: string;

  @Column({ type: 'date', name: 'birthdate' })
  birthdate: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'createdat' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'updatedat' })
  updatedAt: Date;
}
