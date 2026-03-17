# 取得你訂會員卡簡易資訊

- API 路徑：`https://beta-nd-panel-api.nidin.shop/1.0/membership/group/nidinBriefInfo`
- Method：GET

## Request URL Parameter

|欄位｜類型｜敘述｜
|----|----|----|
| membership_id | String | 會員等級 ID |
| activity_id | String | 活動 ID |

## Response example

```json
{
    "status": 200,
    "message": "讀取成功!",
    "description": "讀取成功!",
    "token_need_replace": 0,
    "info": {
        "id": 184,
        "usage_type": 0,
        "name": "你訂會員卡",
        "description": null,
        "membership_group_type": 0,
        "membership_point_type": 2,
        "membership_level_type": 2,
        "level": [
            {
                "id": 1,
                "name": "你訂新手",
                "level": 1
            }
        ],
        "update_time": "2024-05-29 09:58:24",
        "create_time": "2024-05-29 09:58:24"
    }
}
```

## Response fields description

|欄位｜類型｜敘述｜
|----|----|----|
| status | Number | 回應狀態碼 |
| message | String | 回應訊息 |
| description | String | 回應描述訊息 |
| token_need_replace | Number | 是否需要更換 Token，1: 是，0: 否 |
| info | Object | 會員卡簡易資訊 |
| info.id | Number | 會員卡 ID |
| info.usage_type | Number | 使用類型 0:平台，1:品牌，2:門市 |
| info.name | String | 會員卡名稱 |
| info.description | String | 會員卡描述 |
| info.membership_group_type | Number | 會員卡類型 1:你訂型，1:品牌通用型，2:門市獨立型 |
| info.membership_point_type | Number | 會員卡點數制度，1:純積分制，2:點數+積分制 |
| info.membership_level_type | Number | 會員卡等級方案，1:單一級別制，2:升降等級制 |
| info.level | Array | 會員卡等級陣列 |
| info.level[].id | Number | 會員卡等級 ID |
| info.level[].name | String | 會員卡等級名稱 |
| info.level[].level | Number | 會員卡等級 |
| info.update_time | String | 會員卡最後更新時間 |
| info.create_time | String | 會員卡建立時間 |

## Error response example

```json
{
    "status": 1101,
    "message": "輸入資訊錯誤!",
    "description": "輸入資訊錯誤!"
}
```
