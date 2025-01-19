import sql from "./db.js";

export type User = {
  id: string;
  userId: string;
  username: string;
  email: string;
  accessToken: string;
};

export type NewUser = Omit<User, "id">;

export async function createUser(newUser: NewUser) {
  const [user] = await sql<Array<Pick<User, "id">>>`
    insert into users
      (user_id, username, email, access_token)
    values
      (${newUser.userId}, ${newUser.username}, ${newUser.email}, ${newUser.accessToken})
    returning id
  `;

  return user.id;
}

export async function getUser(userId: string): Promise<User | null> {
  const [user] = await sql<User[]>`
    select
      id,
      user_id as "userId",
      username,
      email
    from users
    where user_id = ${userId}
  `;

  return user || null;
}
