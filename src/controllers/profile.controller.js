import { handleErrorClient, handleSuccess } from "../Handlers/responseHandlers.js";
import { updateProfileSchema } from "../validations/profile.validation.js";
import { updateUser, deleteUser, getAllUsers as getAllUsersService } from "../services/user.service.js";
import { findUserById } from "../services/user.service.js";
import { User } from "../entities/user.entity.js";


//obtener todos los usuarios
export async function getAllUsers(req, res) {
  try {
    const users = await getAllUsersService();
    if (!users || users.length === 0) {
      return handleErrorClient(res, 404, "No se encontraron usuarios");
    }

    handleSuccess(res, 200, "Usuarios obtenidos correctamente", users);
  } catch (err) {
    handleErrorClient(res, 500, "Error al obtener los usuarios", err.message);
  }
}

export function getPublicProfile(req, res) {
  handleSuccess(res, 200, "Perfil público obtenido exitosamente", {
    message: "¡Hola! Este es un perfil público. Cualquiera puede verlo.",
  });
}

export function getPrivateProfile(req, res) {
  const user = req.user;

  handleSuccess(res, 200, "Perfil privado obtenido exitosamente", {
    message: `¡Hola, ${user.email}! Este es tu perfil privado. Solo tú puedes verlo.`,
    userData: user,
  });
}

//actualizar perfil privado
export async function updatePrivateProfile(req, res) {
  try {
    const { error, value } = updateProfileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: "error",
        message: "Datos inválidos",
        details: error.details.map((detail) => detail.message),
      });
    }

    const updatedUser = await updateUser(req.user.id, value);
    if (!updatedUser) return handleErrorClient(res, 404, "Usuario no encontrado");

    handleSuccess(res, 200, "Perfil actualizado exitosamente", { 
      id: updatedUser.id,
      email: updatedUser.email
    });
  } catch (err) {
    handleErrorClient(res, 500, "Error al actualizar el perfil", err.message);
  }
}

//eliminar perfil privado
export async function deletePrivateProfile(req, res) {
  try {

    const userIdFromToken = String(req.user.id); // asegurar string
    const { id, email } = req.body;

    // comparar como strings
    if (String(id) !== userIdFromToken) {
      return handleErrorClient(res, 403, "Solo puedes eliminar tu propio perfil");
    }

    const user = await findUserById(userIdFromToken);
    if (!user) return handleErrorClient(res, 404, "Usuario no encontrado");

    await deleteUser(userIdFromToken);

    handleSuccess(res, 200, "Perfil eliminado exitosamente", {
      id: user.id,
      email: user.email,
    });
  } catch (err) {
    handleErrorClient(res, 500, "Error al eliminar el perfil", err.message);
  }
}