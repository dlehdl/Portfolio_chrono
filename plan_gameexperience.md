# GameExperience.tsx 수정 계획

## 목표
- [x] **View All Play Logs**(`GAME_LOGS`)에 **Action Games** / **JRPG Games** 상단 블록과 동일한 타이틀이 중복되지 않게 정리한다.
- [x] **엘든링**, **고스트 오브 쓰시마**는 상단 Action에서 제거하고, 아카이브(`GAME_LOGS`)에만 남긴다(이미 로그에 있으므로 상단만 정리).
- [x] **마블 스파이더맨2**는 `GAME_LOGS`에서 제거하고 **Action Games**(`ACTION_SPOTLIGHT`)에 추가한다.

## 중복 점검 기준
- 상단 Action: `title` 문자열 기준(젤다 야숨은 카드에 `젤다의 전설 야생의 숨결`, 로그에는 `젤다 야생의 숨결`로 표기되어 있으나 동일 작품으로 간주해 로그 쪽 항목을 제거한다).
- 상단 JRPG: `title`과 `GAME_LOGS`의 `name`이 같은 항목을 로그에서 제거한다.

## `GAME_LOGS`에서 제거할 항목 (상단과 중복)
| 로그 `name` | 이유 |
|---------------|------|
| 페르소나3 리로드 | JRPG Games |
| 마블 스파이더맨2 | Action Games로 이동 |
| 파이어 엠블렘 인게이지 | JRPG Games |
| 페르소나5 로열 | JRPG Games |
| 진여신전생5 | JRPG Games |
| 젤다 야생의 숨결 | Action Games(야숨)와 동일 작품 |
| 메타포 리판타지오 | JRPG Games |

## `ACTION_SPOTLIGHT` 변경 후 구성 (순서)
1. 세키로: 섀도우 다이 트와이스  
2. P의 거짓  
3. 젤다의 전설 왕국의 눈물  
4. 젤다의 전설 야생의 숨결  
5. 마블 스파이더맨2 (`genre: Action Adv`, `hours: 30h` — 기존 로그와 동일)

제거: 엘든링, 고스트 오브 쓰시마 (로그에 유지)

## `SUMMARY_STATS.totalGames`
- 로그 배열 길이와 일치시키기 위해, 제거 후 개수 **28**으로 갱신한다.

## 실행 순서
- [x] 본 문서 작성 완료  
- [x] `ACTION_SPOTLIGHT` 수정  
- [x] `GAME_LOGS`에서 위 7개 항목 제거 및 순서 유지  
- [x] `totalGames`를 28로 수정  
