import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import addressServices from "./address.services";

class AddressController {
  // CREATE_ADDRESS ________________________________________________________________

  createAddress = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await addressServices.createAddress(
          req.user?.userId!,
          req.body,
        );

        res.status(201).json({
          success: true,
          message: "Address created successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  );

  // GET_ADDRESSES ________________________________________________________________

  getAddresses = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await addressServices.getAddresses(req.user?.userId!);

        res.status(200).json({
          success: true,
          message: "Addresses retrieved successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  );

  // GET_ADDRESS ________________________________________________________________

  getAddress = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await addressServices.getAddress(
          req.user?.userId!,
          req.params.addressId as string,
        );

        res.status(200).json({
          success: true,
          message: "Address retrieved successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  );

  // UPDATE_ADDRESS ________________________________________________________________

  updateAddress = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await addressServices.updateAddress(
          req.user?.userId!,
          req.params.addressId as string,
          req.body,
        );

        res.status(200).json({
          success: true,
          message: "Address updated successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  );

  // DELETE_ADDRESS ________________________________________________________________

  deleteAddress = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await addressServices.deleteAddress(
          req.user?.userId!,
          req.params.addressId as string,
        );

        res.status(200).json({
          success: true,
          message: "Address deleted successfully",
        });
      } catch (error) {
        next(error);
      }
    },
  );
}

export default new AddressController();
