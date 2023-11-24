using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Bullet : MonoBehaviour
{
    
    public int minDamage;
    public int maxDamage;
    public bool PlayerBullet;

    private void OnTriggerEnter2D(Collider2D collision)
    {
        if (collision.CompareTag("Player") && !PlayerBullet)
        {
<<<<<<< HEAD
            int damage = Random.Range(minDamage, maxDamage);
            collision.GetComponent<Player>().TakeDamage(damage);
            Destroy(gameObject);
            
=======
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
>>>>>>> 450ee509810d72bb780a455110911e61e89088ba
        }

        if (collision.CompareTag("Enemy") && PlayerBullet)
        {
            int damage = Random.Range(minDamage, maxDamage);
            
            collision.GetComponent<Enemycontroller>().TakeDamage(damage);
            Destroy(gameObject);
            
            
        }
    }
    private IEnumerator ResetGotHit(Animator anim, float delay)
    {
        yield return new WaitForSeconds(delay);
        anim.SetBool("GotHit", false);
    }

}
