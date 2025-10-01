import { AppDataSource } from "../config/configDb.js";
import { User } from "../entities/user.entity.js";
import bcrypt from "bcrypt";

const userRepository = AppDataSource.getRepository(User);

export async function getAllUsers() {
  return await userRepository.find({select: ["id", "email"]}); // devuelve un array con todos los usuarios
}

export async function createUser(data) {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const newUser = userRepository.create({
    email: data.email,
    password: hashedPassword,
  });

  return await userRepository.save(newUser);
}

export async function findUserByEmail(email) {
  return await userRepository.findOneBy({ email });
}

//buscar usuario por id
export async function findUserById(id) {
  return await userRepository.findOneBy({ id });
}


//actualizar usuario
export async function updateUser(id, data) {
  const user = await userRepository.findOneBy({ id });
  if (!user) {
    throw new Error("Usuario no encontrado");
  }
  if (data.email) user.email = data.email;
  if (data.password) {
    user.password = await bcrypt.hash(data.password, 10);
  }

  return await userRepository.save(user);
}

//eliminar usuario
export async function deleteUser(id) {
  const user = await userRepository.findOneBy({ id });
  if (!user) throw new Error("Usuario no encontrado");
  return await userRepository.remove(user);
}