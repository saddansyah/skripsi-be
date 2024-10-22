-- "New Comer"
SELECT
  CASE
    WHEN COUNT(co.id) > 0
    AND COUNT(aa.achievement_id) = 0 THEN TRUE
    ELSE FALSE
  END AS should_award
FROM
  waste_collects as co
  LEFT JOIN assigned_achievements as aa ON co.user_id = aa.user_id
  AND aa.achievement_id = 1
WHERE
  co.user_id = '02f4dcda-9e71-4285-9898-068c062655a3';

-- "Container Warrior"
SELECT
  CASE
    WHEN COUNT(cn.id) > 0
    AND COUNT(aa.achievement_id) = 0 THEN TRUE
    ELSE FALSE
  END AS should_award
FROM
  waste_containers as cn
  LEFT JOIN assigned_achievements as aa ON cn.user_id = aa.user_id
  AND aa.achievement_id = 2
WHERE
  cn.user_id = '02f4dcda-9e71-4285-9898-068c062655a3';
