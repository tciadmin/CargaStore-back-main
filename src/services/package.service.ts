import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import { isMulterRequestFiles } from '../config/multerConfig';
import { PackageModel } from '../models';
import { PackageInterface } from '../interface/package.interface';

const editPackageImage = async (req: Request, res: Response) => {
  const { packageId } = req.params;
  if (!isMulterRequestFiles(req.files)) {
    return res
      .status(400)
      .json({ msg: 'Error al subir los archivos' });
  }
  const files = req.files;

  try {
    const single_package = await PackageModel.findByPk(packageId);

    if (!single_package) {
      return res.status(404).json({ msg: 'Paquete no encontrada' });
    }

    const updatedData: Partial<PackageInterface> = {
      image1: files.image1
        ? files.image1[0].path
        : single_package.image1,
      image2: files.image2
        ? files.image2[0].path
        : single_package.image2,
      image3: files.image3
        ? files.image3[0].path
        : single_package.image3,
      image4: files.image4
        ? files.image4[0].path
        : single_package.image4,
    };

    const oldImages = {
      image1: single_package.image1,
      image2: single_package.image2,
      image3: single_package.image3,
      image4: single_package.image4,
    };

    await single_package.update(updatedData);

    // Eliminar las imágenes antiguas si han sido reemplazadas
    Object.keys(oldImages).forEach((key) => {
      const oldPath = oldImages[key as keyof typeof oldImages];
      const newPath = updatedData[key as keyof typeof updatedData];
      if (oldPath && newPath && oldPath !== newPath) {
        fs.unlink(path.resolve(oldPath), (err) => {
          if (err)
            console.error(
              `Error al eliminar la imagen antigua: ${err.message}`
            );
        });
      }
    });

    return res
      .status(200)
      .json({
        msg: 'Imágenes actualizadas con éxito',
        single_package,
      });
  } catch (error) {
    res.status(500).send(error);
  }
};

export default {
  editPackageImage,
};
