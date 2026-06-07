// Куратированный barrel. Исходный авто-сгенерированный re-export всех сервисов
// давал коллизии имён *RequestParams (в спеке дублируются operationId между тегами,
// что приводит к TS2308 при `export *`). Экспортируем только сервисы, реально
// используемые приложением. Файл внесён в .openapi-generator-ignore, чтобы
// перегенерация его не перезаписывала.
export * from './categories.service';
import { CategoriesService } from './categories.service';
export * from './logon.service';
import { LogonService } from './logon.service';
export const APIS = [CategoriesService, LogonService];
