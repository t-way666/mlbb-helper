SELECT
    t.table_name,
    c.column_name,
    c.data_type,
    CASE
        WHEN c.character_maximum_length IS NOT NULL THEN '(' || c.character_maximum_length || ')'
        WHEN c.numeric_precision IS NOT NULL AND c.numeric_scale IS NOT NULL THEN '(' || c.numeric_precision || ',' || c.numeric_scale || ')'
        WHEN c.numeric_precision IS NOT NULL THEN '(' || c.numeric_precision || ')'
        ELSE ''
    END AS data_type_details,
    CASE
        WHEN c.is_nullable = 'YES' THEN 'NULLABLE'
        ELSE 'NOT NULL'
    END AS nullable_status,
    (
        -- Подзапрос для получения информации о PRIMARY KEY и UNIQUE constraints
        SELECT array_agg(tc.constraint_type)
        FROM information_schema.key_column_usage kcu_pk
        JOIN information_schema.table_constraints tc
            ON kcu_pk.constraint_name = tc.constraint_name
            AND kcu_pk.table_schema = tc.table_schema
        WHERE kcu_pk.table_name = t.table_name
            AND kcu_pk.column_name = c.column_name
            AND tc.constraint_type IN ('PRIMARY KEY', 'UNIQUE')
    ) AS constraints,
    (
        -- Подзапрос для получения информации о FOREIGN KEY
        SELECT array_agg(
            'FK to ' || ccu_ref.table_schema || '.' || ccu_ref.table_name || '.' || ccu_ref.column_name
        )
        FROM information_schema.referential_constraints rc
        JOIN information_schema.key_column_usage kcu_fk_col -- Это таблица, которая содержит информацию о столбце ВНЕШНЕГО ключа
            ON rc.constraint_name = kcu_fk_col.constraint_name
            AND rc.constraint_schema = kcu_fk_col.constraint_schema
        JOIN information_schema.constraint_column_usage ccu_ref -- Это таблица, которая содержит информацию о столбце ЦЕЛЕВОГО (ссылочного) ключа
            ON rc.unique_constraint_name = ccu_ref.constraint_name
            AND rc.unique_constraint_schema = ccu_ref.constraint_schema
        WHERE kcu_fk_col.table_schema = t.table_schema
            AND kcu_fk_col.table_name = t.table_name
            AND kcu_fk_col.column_name = c.column_name -- Фильтруем по текущему столбцу из внешнего запроса
    ) AS foreign_keys
FROM
    information_schema.tables t
JOIN
    information_schema.columns c ON t.table_schema = c.table_schema AND t.table_name = c.table_name
WHERE
    t.table_schema = 'public' -- Замените 'public' на имя вашей схемы, если она другая
    AND t.table_type = 'BASE TABLE'
ORDER BY
    t.table_name,
    c.ordinal_position;