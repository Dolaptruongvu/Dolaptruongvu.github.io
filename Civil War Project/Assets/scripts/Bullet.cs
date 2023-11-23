using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Bullet : MonoBehaviour
{
    public int minDamage;
    public int maxDamage;
    public bool goodSizeBullet;

    private void OnTriggerEnter2D(Collider2D collision)
    {
        if (collision.CompareTag("Player") && !goodSizeBullet)
        {
            int damaged = Random.Range(minDamage, maxDamage);
            collision.GetComponent<Player>().TakeDamage(damaged); // damage the player now
            Destroy(gameObject);
        }
        if (collision.CompareTag("Enemy") && goodSizeBullet)
        {
            Enemycontroller enemyController = collision.GetComponent<Enemycontroller>();
            int damaged = Random.Range(minDamage, maxDamage);
            enemyController.TakeDamage(damaged); // damage the player now
            Animator EnemyAnim = enemyController.GetComponentInChildren<Animator>();
            EnemyAnim.SetBool("GotHit", true);
            Destroy(gameObject);
            StartCoroutine(ResetGotHit(EnemyAnim, 0.1f));
        }

    }
    private IEnumerator ResetGotHit(Animator anim, float delay)
    {
        yield return new WaitForSeconds(delay);
        anim.SetBool("GotHit", false);
    }

}
