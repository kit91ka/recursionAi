/**
 * Дружелюбные алиасы для сгенерированных OpenAPI-типов с длинными именами.
 * Сам клиент (core/api) не редактируем — это слой адаптации имён.
 */
import {
  ZidiumWebServiceFrontCategoryDto,
  ZidiumWebServiceFrontEditCategoryDto,
  ZidiumWebServiceFrontDictionariesCategoriesDtoCategoryListDto,
} from './api';

export type Category = ZidiumWebServiceFrontCategoryDto;
export type EditCategory = ZidiumWebServiceFrontEditCategoryDto;
export type CategoryList = ZidiumWebServiceFrontDictionariesCategoriesDtoCategoryListDto;

export type {
  LogonRequestDto,
  LogonResponseDto,
  TokensResponseDto,
  RefreshTokenRequestDto,
  CurrentUserDto,
} from './api';
