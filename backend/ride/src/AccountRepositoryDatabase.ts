import pgp from "pg-promise";
import AccountDAO from "./AccountRepository";
import GetAccountAccountDAO from "./GetAccountAccountDAO";
import SignupAccountDAO from "./SignupAccountDAO";
import Account from "./Account";
import AccountRepository from "./AccountRepository";

export default class AccountRepositoryDatabase implements AccountRepository {

	async save (account: Account) {
		const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		await connection.query("insert into cccat14.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)", [account.accountId, account.name, account.email, account.cpf, account.carPlate, !!account.isPassenger, !!account.isDriver]);
		await connection.$pool.end();
	}

	async getById (accountId: string): Promise<Account | undefined> {
		const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		const [account] = await connection.query("select * from cccat14.account where account_id = $1", [accountId]);
		await connection.$pool.end();
		if (!account) return undefined;
		return Account.restore(account.account_id, account.name, account.email, account.cpf, account.car_plate, account.is_passenger, account.is_driver);
	}
	
	async getByEmail (email: string): Promise<Account | undefined> {
		const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		const [account] = await connection.query("select * from cccat14.account where email = $1", [email]);
		await connection.$pool.end();
		if (!account) return undefined;
		return Account.restore(account.account_id, account.name, account.email, account.cpf, account.car_plate, account.is_passenger, account.is_driver);
	}
}
