import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AlterTransactionAlterValue1588610789852
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'transactions',
      'value',
      new TableColumn({
        name: 'value',
        type: 'decimal',
        precision: 10,
        scale: 2,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'transactions',
      'value',
      new TableColumn({
        name: 'value',
        type: 'int',
      }),
    );
  }
}
