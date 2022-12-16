package utils

import "database/sql"

func GetNullableString(str string) sql.NullString {
	if len(str) == 0 {
		return sql.NullString{String: str, Valid: false}
	}

	return sql.NullString{String: str, Valid: true}
}
