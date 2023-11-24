using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Pathfinding;

public class EnemyAI : MonoBehaviour
{
    public bool roaming = true;
    public float moveSpeed;
    public float nextWPDistance;
    public Seeker seeker;
    public bool updateContinuesPath;
    Path path;
    Coroutine moveCoroutine;
    bool reachDestination = false;

    // shoot 
    public bool isShootable = false;
    public GameObject bullet;
    public float bulletSpeed;
    public float timeBtwFire;
    private float fireCooldown;

    private void Start()
    {

        reachDestination = true;
        InvokeRepeating("CalculatePath", 0f, 0.5f);
    }
    private void Update()
    {
        fireCooldown -= Time.deltaTime;
        if (fireCooldown < 0)
        {
            fireCooldown = timeBtwFire;
            if (isShootable == true)
            EnemyFireBullet();
        }
    }
    void EnemyFireBullet()
    {
        var bulletTemp = Instantiate(bullet, transform.position, Quaternion.identity);

        Rigidbody2D rb = bulletTemp.GetComponent<Rigidbody2D>();
        Vector3 playerPos = FindObjectOfType<Player>().transform.position;
        Vector3 direction = playerPos - transform.position;
        rb.AddForce(direction.normalized * bulletSpeed, ForceMode2D.Impulse);



    }
    void CalculatePath()
    {
        Vector2 target = FindTarget();
        if (seeker.IsDone() && (reachDestination || updateContinuesPath))
        {
            seeker.StartPath(transform.position, target, OnPathComplete); // caculate the min distance base on current position and target and then call callback

        }
    }
    void OnPathComplete(Path p)
    {
        if (p.error) return;
        path = p;
        // Move to target
        MoveToTarget();

    }
    void MoveToTarget()
    {
        if (moveCoroutine != null) StopCoroutine(moveCoroutine); // 1 script contain 1 function corotine , so we stop when we have one corotine active
        moveCoroutine = StartCoroutine(MovetoTargetCoroutine());

    }
    IEnumerator MovetoTargetCoroutine()
    {
        int currentWP = 0;
        reachDestination = false;

        while (currentWP < path.vectorPath.Count) // jump in point path.vectorPath
        {
            Vector2 direction = ((Vector2)path.vectorPath[currentWP] - (Vector2)transform.position).normalized;
            Vector2 force = direction * moveSpeed * Time.deltaTime;
            transform.position += (Vector3)force;
            float distance = Vector2.Distance(transform.position, path.vectorPath[currentWP]); // calculate again the next point
            if (distance < nextWPDistance)
            {
                currentWP++;
            }
            yield return null; // work each frame
        }
        reachDestination = true;

    }
    Vector2 FindTarget()
    {
        Vector3 playerPos = FindObjectOfType<Player>().transform.position;
        if (roaming == true)
        {
            return (Vector2)playerPos + (Random.Range(1f, 5f) * new Vector2(Random.Range(-1, 1), Random.Range(-1, 1)).normalized); // create a position for enemy with random distance and random direction ( normilized mean we dont care a bout the magnitude )
        }
        else
        {
            return playerPos;
        }

    }
}