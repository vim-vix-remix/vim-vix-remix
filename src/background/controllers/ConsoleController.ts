import { injectable } from "tsyringe";
import ConsoleUseCase from "../usecases/ConsoleUseCase";

@injectable()
export default class ConsoleController {
  constructor(private readonly consoleUseCase: ConsoleUseCase) {}

  resize(width: number, height: number) {
    return this.consoleUseCase.resize(width, height);
  }
}
